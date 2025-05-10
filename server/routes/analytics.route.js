import express from "express";
import { ProtectRoute } from "../middlewares/auth.middleware.js";
import { GetAnalyticsData, GetDailySalesData } from "../controllers/analytics.controller.js";

const AnalyticsRoute = express.Router();

AnalyticsRoute.get("/", ProtectRoute, async (req, res) => {
  try {
    const analyticsData = await GetAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await GetDailySalesData(startDate, endDate);

    // Send the combined analytics and daily sales data to the client
    return res.status(200).json({
      success: true,
      ...analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.error("AnalyticsRoute ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" }); // fixed typo: "messsage" -> "message"
  }
});

export default AnalyticsRoute;
