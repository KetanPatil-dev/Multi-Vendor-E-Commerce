import express from "express"
import { ProtectRoute } from "../middlewares/auth.middleware.js"
import { CreateCheckoutSession } from "../controllers/payment.controller.js"

const PaymentRoutes= express.Router()
PaymentRoutes.post("/create-checkout-session",ProtectRoute,CreateCheckoutSession)

export default PaymentRoutes