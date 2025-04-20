import express from "express"
import { ProtectRoute } from "../middlewares/auth.middleware.js"
import { GetAnalyticsData } from "../controllers/analytics.controller.js"
const AnalyticsRoute = express.Router()
AnalyticsRoute.get("/",ProtectRoute, async(req ,res)=>{
    try {
        const analyticsData= await GetAnalyticsData()
const endDate= new Date();
const startDate= new Date(endDate.getTime()-7*24*60*60*1000)
const dailySalesData= await GetDailySalesData(startDate,endDate)
        
    } catch (error) {
        return res
      .status(500)
      .json({ success: false, messsage: "Internal Server Error" });
  
    }
})

export default AnalyticsRoute