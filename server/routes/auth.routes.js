import express from "express"
import { Login, Logout, RefreshToken, Signup } from "../controllers/auth.controllers.js"

const AuthRoutes=express.Router()

AuthRoutes.post("/signup",Signup)
AuthRoutes.post("/logout",Logout)
AuthRoutes.post("/login",Login)
AuthRoutes.post("/refresh-token",RefreshToken)
export default AuthRoutes