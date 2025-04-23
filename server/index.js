import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./connect.js";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/auth.routes.js";
import ProductRoutes from "./routes/product.route.js";
import CartRoutes from "./routes/cart.route.js";
import CouponRoutes from "./routes/coupons.route.js";
import PaymentRoutes from "./routes/payment.routes.js";
import AnalyticsRoute from "./routes/analytics.route.js";
import cors from 'cors';

dotenv.config();



const app = express();
const PORT = process.env.PORT || 9010;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
 
}));



const Start = async () => {
  try {
    ConnectDB();
    app.use("/api/auth", AuthRoutes);
    app.use("/api/products", ProductRoutes);
    app.use("/api/cart", CartRoutes);
    app.use("/api/coupon", CouponRoutes);
    app.use("/api/payment", PaymentRoutes);
    app.use("/api/analytics", AnalyticsRoute);
    app.listen(PORT, () => console.log(`Server Started on PORT:${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

Start();
