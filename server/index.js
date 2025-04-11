import express from "express"
import dotenv from "dotenv"
import { ConnectDB } from "./connect.js"

import AuthRoutes from "./routes/auth.routes.js"
dotenv.config()

const app=express()
const PORT=process.env.PORT || 9010
app.use(express.json())

const Start=async()=>{
    try {
       ConnectDB()
       app.use("/auth",AuthRoutes)
       app.listen(PORT,()=>console.log(`Server Started on PORT:${PORT}`))

    } catch (error) {
        console.log(error)
    }
}


Start()