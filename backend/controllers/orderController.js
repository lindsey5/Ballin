import { Op } from 'sequelize';
import { Customer, Order, OrderAddress, OrderItem, Product, Thumbnail, Variant } from '../models/index.js';
import { createOrder } from "../services/orderService.js";
import { sendOrderUpdate } from '../services/emailService.js';
import { sendAdminNotification, sendCustomerNotification, sendLowStockNotification } from '../services/notificationService.js';

export const createNewOrder = async (req, res) => {
    try{
        const { address, payment_details, items } = req.body;
        const { subtotal, shipping_fee, total, } = payment_details;
        const { firstname, lastname, ...rest } = address;

        const fullAddress = { fullname: `${firstname} ${lastname}`, ...rest }

        const order = await createOrder(req, {
            address: fullAddress,
            subtotal,
            total,
            shipping_fee,
            items,
            payment_method: 'COD'
        })

        const customer = await Customer.findByPk(req.user_id);

        if(customer){
            await sendAdminNotification(customer.id, order.order_id, `placed an order`)
        }

        res.status(201).json({ success: true, order });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const get_order_by_id = async (req, res) => {
    try{
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: OrderAddress,
                    as: 'orderAddress'
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['firstname', 'lastname', 'email'],
                },
                {
                    model: OrderItem,
                    as: 'order_items',
                    include: [
                        { 
                            model: Product, 
                            as: 'product',
                            include: [Thumbnail]
                        }
                    ]
                }
            ]
        });

        if(!order){
            return res.status(404).json({ error: 'Order not found'});
        }

        res.status(200).json({ success: true, order })

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const get_all_orders = async (req, res) => {
    try {
        const id = req.user_id
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.searchTerm || '';
        const date = req.query.date || undefined;
        const status = req.query.status || '';

        const isCustomer = await Customer.findByPk(id);

        // Build the where conditions object
        let whereConditions = {};

        // Add customer filter if user is a customer
        if (isCustomer) {
            whereConditions.customer_id = id;
        }

        // Add search term conditions
        if (searchTerm) {
            whereConditions[Op.or] = [
                { order_id: { [Op.like]: `${searchTerm}` } },
                { '$customer.firstname$': { [Op.like]: `${searchTerm}` } },
                { '$customer.lastname$': { [Op.like]: `${searchTerm}` } },
            ];
        }

        // Add status filter
        if (status) whereConditions.status = status;

        // Add date filter
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            whereConditions.order_date = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        const query = { 
            where: whereConditions,
            limit, 
            offset,
            order: [["order_date", "DESC"]],
            include: [
                {
                    model: Customer,
                    required: true,
                    as: 'customer'
                },
                {
                    model: OrderItem,
                    required: false,
                    as: 'order_items',
                    include: [
                        {
                            model: Product,
                            required: false,
                            as: 'product',
                            attributes: ['product_name'],
                            include: [Thumbnail]
                        }
                    ]
                }
            ]
        };

        // For count query, we need to include the same conditions but without limit/offset
        const countQuery = {
            where: query.where,
            include: query.include
        };

        const [orders, total] = await Promise.all([
            Order.findAll(query),
            Order.count(countQuery)
        ]);

        res.status(200).json({
            success: true,
            orders,
            total: total,
            totalPages: Math.ceil(total / limit),
            page
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const update_order = async (req, res) => {
    try{
        const order = await Order.findOne({
            where: { 
                order_id: req.params.id
            },
            include: [
                {
                model: OrderItem,
                as: 'order_items'
                }
            ]
        });
        if(!order){
            return res.status(404).json({ error: 'Order not found' });
        }

        const status = req.body.status;
        if(status === 'Shipped'){
            const order_items = order.toJSON().order_items;
            for(const item of order_items){
                const variant = await Variant.findOne({
                    where: {
                        product_id: item.product_id,
                        size: item.size,
                        color: item.color,
                    }
                })
                const prevStock = variant.stock;
                const newStock = prevStock - item.quantity
                variant.stock = newStock;
                await variant.save();
                if(variant.stock <= 10){
                    const product = await Product.findByPk(item.product_id)
                    await sendLowStockNotification(product.product_name, product.id, variant.sku, prevStock, newStock)
                }
            }
        }
        const prevStatus = order.status;
        const newStatus = status;
        order.status = newStatus;
        await order.save();

        let customer = await Customer.findByPk(order.dataValues.customer_id)
        customer = customer.toJSON();

        await sendCustomerNotification(customer.id, order.order_id, prevStatus, newStatus);
        await sendOrderUpdate(customer.email, order.dataValues.order_id, customer.firstname, order.dataValues.status)
        res.status(200).json({ success: true, order });

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const cancel_order = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Ensure the user owns this order
        if (order.customer_id !== req.user_id) {
            return res.status(403).json({ error: "Unauthorized: You cannot cancel this order" });
        }

        // Prevent cancelling if already cancelled or completed
        if (order.status === "Cancelled") {
            return res.status(400).json({ error: "Order already cancelled" });
        }
        if (order.status !== 'Pending') {
            return res.status(400).json({ error: "Only pending orders can be cancel." });
        }

        // Cancel the order
        order.status = "Cancelled";
        await order.save();

        await sendAdminNotification(req.user_id, order.order_id, `decided to cancel the order`);
        res.status(200).json({ success: true, order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

export const receive_order = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Ensure the user owns this order
        if (order.customer_id !== req.user_id) {
            return res.status(403).json({ error: "Unauthorized: You cannot cancel this order" });
        }
        if (order.status !== 'Delivered') {
            return res.status(400).json({ error: "Only delivered orders can be cancel." });
        }

        // Cancel the order
        order.status = "Received";
        await order.save();

        await sendAdminNotification(req.user_id, order.order_id, `marked the order to Received`);

        res.status(200).json({ success: true, order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

export const get_total_orders = async (req, res) => {
    try{
        const totalOrders = await Order.count();
        res.status(200).json({ success: true, totalOrders });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const get_most_recent_orders = async (req, res) => {
    try{
        const recent_orders = await Order.findAll({
            limit: 10,
            order: [["order_date", "DESC"]],
            include: [
                {
                    model: Customer,
                    required: false,
                    as: 'customer'
                },
            ]
        })

        res.status(200).json({ success: true, recent_orders});

    }catch(err){    
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}