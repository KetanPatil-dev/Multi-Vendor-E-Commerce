import CoupounModel from "../models/coupoun.model.js";
import mongoose from "mongoose";

// Helper to cast userId to ObjectId
function toObjectId(id) {
  return typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;
}

export const GetCoupon = async (req, res) => {
  try {
    const coupon = await CoupounModel.findOne({
      userId: toObjectId(req.user._id),
      isActive: true,
    });
    res.json(coupon);
  } catch (error) {
    console.log("Error in getCoupoun Controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const ValidateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await CoupounModel.findOne({
      code: code,
      userId: toObjectId(req.user._id),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not Found" });
    }

    // Expiry check
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon Expired" });
    }

    res.json({
      message: "Valid Coupon",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in Validate Coupon", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
