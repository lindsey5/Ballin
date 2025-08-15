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
    try{
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.searchTerm || '';
        const date = req.query.date || undefined;

        let query = { 
            limit, 
            offset,
            include: [
                {
                    model: Customer,
                    required: false,
                    as: 'customer'
                },
            ]
         }

        if (searchTerm) {
            query = {
                ...query,
                where: {
                    [Op.or]: [
                        { order_id: { [Op.like]: `%${searchTerm}%` } },
                        { '$customer.firstname$': { [Op.like]: `%${searchTerm}%` } },
                        { '$customer.lastname$': { [Op.like]: `%${searchTerm}%` } },
                    ]
                }
            };
        }

        if (date) {
            query = {
                ...query,
                where: {
                    ...(query.where || {}), 
                    order_date: {
                        [Op.eq]: date
                    }
                }
            };
        }

        const [orders, total] = await Promise.all([
            Order.findAll(query),
            Order.count(query)
        ])

        res.status(200).json({
            success: true,
            orders,
            total: total,
            totalPages: Math.ceil(total / limit),
            page
        })
    }catch(err){
        console.log(err)
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