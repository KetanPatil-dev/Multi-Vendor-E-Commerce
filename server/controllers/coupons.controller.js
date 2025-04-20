import CoupounModel from "../models/coupoun.model.js";

export const GetCoupon = async (req, res) => {
  try {
    const coupoun = await CoupounModel.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupoun || null);
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
    const coupon = await CoupounModel.find({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupoun) {
      return res.status(404).json({ message: "Coupoun not Found" });
    }
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
