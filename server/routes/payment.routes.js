import express from "express"
import { ProtectRoute } from "../middlewares/auth.middleware.js"
import { CheckoutSuccess, CreateCheckoutSession } from "../controllers/payment.controller.js"

const PaymentRoutes= express.Router()
PaymentRoutes.post("/create-checkout-session",ProtectRoute,CreateCheckoutSession)
PaymentRoutes.post("/checkout-success",ProtectRoute,CheckoutSuccess)

export default PaymentRoutes