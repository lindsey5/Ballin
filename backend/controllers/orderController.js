import { Op } from 'sequelize';
import { Customer, Order, OrderAddress, OrderItem, Product, Thumbnail } from '../models/index.js';
import { createOrder } from "../services/orderService.js";

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
                    model: OrderAddress
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
            whereConditions.order_date = {
                [Op.eq]: date
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
        const order = await Order.findByPk(req.params.id);
        if(!order){
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = req.body.status;
        await order.save();

        res.status(200).json({ success: true, order });

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

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