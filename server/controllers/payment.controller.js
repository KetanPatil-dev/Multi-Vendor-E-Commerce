import { stripe } from "../lib/stripe.js";
import CoupounModel from "../models/coupoun.model.js";
import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";

// --- Helper: Always cast userId to ObjectId ---
function toObjectId(id) {
  return typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;
}

export const CreateCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or Empty Products Array" });
    }

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await CoupounModel.findOne({
        code: couponCode,
        userId: toObjectId(req.user._id), // FIXED: Always ObjectId
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }

    console.log("Total amount before coupon creation:", totalAmount);

    

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            _id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });
    if (totalAmount >= 200) {
      
      await createNewCoupoun(req.user._id);
      
    }
    return res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupoun(userId) {
  await CoupounModel.findOneAndDelete({userId})
  try {
    const newCoupon = new CoupounModel({
      code: "TOFHA" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: toObjectId(userId), // FIXED: Always ObjectId
      isActive: true,
    });
    await newCoupon.save();
    console.log("Coupon created:", newCoupon);
    return newCoupon;
  } catch (err) {
    console.error("Failed to create coupon:", err);
    throw err;
  }
}

export const CheckoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      const existingOrder = await OrderModel.findOne({ stripeSessionId: sessionId });
      if (existingOrder)
        return res.status(409).json({ message: "Order already exists in Stripe Session" });

      if (session.metadata.couponCode) {
        await CoupounModel.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: toObjectId(session.metadata.userId), // FIXED: Always ObjectId
          },
          {
            isActive: false,
          }
        );
      }
      const products = JSON.parse(session.metadata.products);
      const newOrder = new OrderModel({
        user: toObjectId(session.metadata.userId), // Optional: keep types consistent
        products: products.map((product) => ({
          product: product._id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });
      await newOrder.save();
      return res.status(200).json({
        success: true,
        message: "Payment Successful, order created and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.stripeSessionId) {
      return res.status(409).json({
        success: false,
        message: "Order already exists for this Stripe session.",
      });
    }
    console.log("ERROR", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
