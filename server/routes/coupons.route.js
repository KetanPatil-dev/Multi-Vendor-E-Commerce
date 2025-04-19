import express from "express"
import { ProtectRoute } from "../middlewares/auth.middleware.js"
import { GetCoupon, ValidateCoupon } from "../controllers/coupons.controller.js"
const CouponRoutes=express.Router()

CouponRoutes.get("/",ProtectRoute,GetCoupon)
CouponRoutes.get("/validate",ProtectRoute,ValidateCoupon)
export default CouponRoutes