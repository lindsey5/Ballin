import { Order } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

export const getSalesThisWeek = async (req, res) => {
    try {
        const today = new Date();

        // Get start of week (Monday)
        const firstDayOfWeek = new Date(today);
        const day = firstDayOfWeek.getDay(); 
        const diff = firstDayOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        firstDayOfWeek.setDate(diff);
        firstDayOfWeek.setHours(0, 0, 0, 0);

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);

        const totalSalesThisWeek = await Order.sum("total", {
            where: {
                status: { [Op.in]: ['Delivered', 'Received'] },
                order_date: {
                    [Op.between]: [firstDayOfWeek, lastDayOfWeek],
                },
            },
        });

        res.status(200).json({ success: true, totalSalesThisWeek });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

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

export const getSalesThisYear = async (req, res) => {
    try {
        const today = new Date();

        // Start of the year: Jan 1st, 00:00:00
        const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);

        // End of the year: Dec 31st, 23:59:59
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

        const totalSalesThisYear = await Order.sum("total", {
            where: {
                status: { [Op.in]: ['Delivered', 'Received'] },
                order_date: {
                    [Op.between]: [startOfYear, endOfYear],
                },
            },
        });

        res.status(200).json({ success: true, totalSalesThisYear });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

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

export const getOverallSales = async (req, res) => {
    try{

        const overallSales = await Order.sum("total", {
            where: {
                status: { [Op.in] : ['Delivered', 'Received']},
            },
        });

        res.status(200).json({ success: true, overallSales });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}