import express from "express"
import { GetProfile, Login, Logout, RefreshToken, Signup } from "../controllers/auth.controllers.js"
import { ProtectRoute } from "../middlewares/auth.middleware.js"

const AuthRoutes=express.Router()

AuthRoutes.post("/signup",Signup)
AuthRoutes.post("/logout",Logout)
AuthRoutes.post("/login",Login)
AuthRoutes.post("/refresh-token",RefreshToken)
AuthRoutes.get("/profile",ProtectRoute,GetProfile)
export default AuthRoutes