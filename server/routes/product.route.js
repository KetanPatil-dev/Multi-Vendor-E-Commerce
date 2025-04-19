import express from "express"
import { CreateProduct, DeleteProduct, GetAllProducts, GetFeaturedProducts, GetProductsByCategory, RecommendProducts, toggleFeatureProduct } from "../controllers/product.controller.js"
import { AdminRoute, ProtectRoute } from "../middlewares/auth.middleware.js"

const ProductRoutes= express.Router()

ProductRoutes.get("/getallproducts",ProtectRoute,AdminRoute,GetAllProducts)
ProductRoutes.get("/featured",GetFeaturedProducts)
ProductRoutes.post("/",ProtectRoute,AdminRoute,CreateProduct)
ProductRoutes.delete("/:id",ProtectRoute,AdminRoute,DeleteProduct)
ProductRoutes.get("/recommendations",RecommendProducts)
ProductRoutes.get("/category/:category",GetProductsByCategory)
ProductRoutes.patch("/:id",ProtectRoute,AdminRoute,toggleFeatureProduct)
export default ProductRoutes