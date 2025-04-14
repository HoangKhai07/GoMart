import OrderModel from "../model/order.model.js"
import mongoose from "mongoose"

export const getStatisticsController = async (req, res) => {
    try {
        // Thống kê tổng doanh thu
        const totalRevenue = await OrderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmt" }
                }
            }
        ]);

        // Thống kê doanh thu theo tháng (12 tháng gần nhất)
        const today = new Date();
        const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);
        
        const monthlyRevenue = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$totalAmt" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Thống kê doanh thu theo tuần (12 tuần gần nhất)
        const twelveWeeksAgo = new Date();
        twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7);
        
        const weeklyRevenue = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveWeeksAgo }
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" },
                        week: { $week: "$createdAt" }
                    },
                    revenue: { $sum: "$totalAmt" },
                    firstDay: { $min: "$createdAt" }
                }
            },
            {
                $sort: { "firstDay": 1 }
            },
            {
                $project: {
                    _id: 1,
                    revenue: 1,
                    firstDay: 1
                }
            }
        ]);
        
        // Thống kê doanh thu theo năm (5 năm gần nhất)
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        
        const yearlyRevenue = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: fiveYearsAgo }
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" }
                    },
                    revenue: { $sum: "$totalAmt" }
                }
            },
            {
                $sort: { "_id.year": 1 }
            }
        ]);

        // Thống kê đơn hàng theo trạng thái
        const orderStatusCounts = await OrderModel.aggregate([
            {
                $group: {
                    _id: "$order_status",
                    count: { $sum: 1 }
                }
            }
        ]);

  
        const totalOrders = await OrderModel.countDocuments();

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        
        const todayOrders = await OrderModel.countDocuments({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });

        return res.json({
            message: "Lấy thống kê thành công",
            error: false,
            success: true,
            data: {
                totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
                monthlyRevenue: monthlyRevenue,
                weeklyRevenue: weeklyRevenue,
                yearlyRevenue: yearlyRevenue,
                orderStatusCounts: orderStatusCounts,
                totalOrders: totalOrders,
                todayOrders: todayOrders
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}