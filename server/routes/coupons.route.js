import express from "express"
import { ProtectRoute } from "../middlewares/auth.middleware.js"
import { GetCoupon } from "../controllers/coupons.controller.js"
const CouponRoutes=express.Router()

CouponRoutes.get("/",ProtectRoute,GetCoupon)
export default CouponRoutes