import { Order, OrderItem, Product, Thumbnail, Variant } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

export const getSalesToday = async (req, res) => {
    try{
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const totalSalesToday = await Order.sum("total", {
            where: {
                status: { [Op.in] : ['Delivered', 'Received']},
                order_date: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
        });

        res.status(200).json({ success: true, totalSalesToday });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const getSalesThisMonth = async (req, res) => {
    try{
        const today = new Date();

        // Start of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // End of the current month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const totalSalesThisMonth = await Order.sum("total", {
            where: {
            status: { [Op.in]: ["Delivered", "Received"] },
            order_date: {
                [Op.between]: [startOfMonth, endOfMonth],
            },
            },
        });

        res.status(200).json({ success: true, totalSalesThisMonth });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const getSalesPerMonth = async (req, res) => {
    const currentYear = new Date().getFullYear();
    
    try{
        const salesPerMonth = await Order.findAll({
            attributes: [
                [fn("MONTH", col("order_date")), "month"], 
                [fn("YEAR", col("order_date")), "year"],  
                [fn("SUM", col("total")), "totalSales"],
            ],
            where: {
            status: { [Op.in]: ["Delivered", "Received"] },
            order_date: {
                [Op.between]: [
                new Date(currentYear, 0, 1),   
                new Date(currentYear, 11, 31, 23, 59, 59, 999),
                ],
            },
            },
            group: [fn("YEAR", col("order_date")), fn("MONTH", col("order_date"))],
            order: [[literal("year"), "ASC"], [literal("month"), "ASC"]],
            raw: true,
        });

        res.status(200).json({ success: true, salesPerMonth });

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}