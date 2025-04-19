import express from "express";
import { ProtectRoute } from "../middlewares/auth.middleware.js";
import { AddToCart, GetCartProducts, RemoveAllFromCart, UpdateQuantity } from "../controllers/cart.controller.js";

const CartRoutes = express.Router();
CartRoutes.get("/", ProtectRoute, GetCartProducts);
CartRoutes.post("/", ProtectRoute, AddToCart);
CartRoutes.delete("/", ProtectRoute, RemoveAllFromCart);
CartRoutes.put("/:id", ProtectRoute, UpdateQuantity);
export default CartRoutes;
