import express from "express"
import { GetAllProducts } from "../controllers/product.controller.js"
import { AdminRoute, ProtectRoute } from "../middlewares/auth.middleware.js"

const ProductRoutes= express.Router()

ProductRoutes.get("/getallproducts",ProtectRoute,AdminRoute,GetAllProducts)
export default ProductRoutes