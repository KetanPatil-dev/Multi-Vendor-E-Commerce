import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

// Utility: Get overall analytics data
export const GetAnalyticsData = async () => {
  const totalUsers = await UserModel.countDocuments();
  const totalProducts = await ProductModel.countDocuments();
  const salesData = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

// Utility: Get daily sales data between two dates
export const GetDailySalesData = async (startDate, endDate) => {
  const dailySalesData = await OrderModel.aggregate([
    {
      $match: {
        createdAt: {
          $gt: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const dateArray = getDatesInRange(startDate, endDate);
  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date); // FIXED: use _id
    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    };
  });
};

// Helper: Get all dates in range as YYYY-MM-DD strings
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
