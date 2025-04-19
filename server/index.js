import express from "express"
import dotenv from "dotenv"
import { ConnectDB } from "./connect.js"
import cookieParser from "cookie-parser"
import AuthRoutes from "./routes/auth.routes.js"
import ProductRoutes from "./routes/product.route.js"
import CartRoutes from "./routes/cart.route.js"
import CouponRoutes from "./routes/coupons.route.js"
dotenv.config()

const app=express()
const PORT=process.env.PORT || 9010
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

const Start=async()=>{
    try {
       ConnectDB()
       app.use("/auth",AuthRoutes)
       app.use("/products",ProductRoutes)
       app.use("/cart",CartRoutes)
       app.use("/coupon",CouponRoutes)
       app.listen(PORT,()=>console.log(`Server Started on PORT:${PORT}`))

    } catch (error) {
        console.log(error)
    }
}


Start()