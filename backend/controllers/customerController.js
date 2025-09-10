import { Customer, Order } from '../models/index.js';
import { fn, col, Op } from 'sequelize';

export const getCustomer = async (req, res) => {
    try{
        const customer = await Customer.findByPk(req.user_id);
        if(!customer){
            res.status(404).json({ error: 'Customer not found'});
        }

        res.status(200).json({ success: true, customer });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

export const getAllCustomers = async (req, res) => {
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // search term
        const search = req.query.search || "";

        const whereCondition = search
        ? {
            [Op.or]: [
                { email: { [Op.like]: `%${search}%` } },
                { firstname: { [Op.like]: `%${search}%` } },
                { lastname: { [Op.like]: `%${search}%` } },
            ],
            }
        : {};

        // query with search + pagination
        const { count, rows } = await Customer.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["firstname", "ASC"]],
        });

        const customers = await Promise.all(rows.map(async (customer) => {
            const completedOrders = await customer.getCompletedOrders();
            const pendingOrders = await customer.getPendingOrders();
            const lastOrder = await customer.getLastOrder();

            return { ...customer.toJSON(), completedOrders, pendingOrders, lastOrder}
        }))

        res.status(200).json({
            success: true,
            customers,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};


export const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Order.findAll({
        where: {
            status: { [Op.in] : ['Delivered', 'Received'] } 
        },
        attributes: [
            'customer_id',
            [fn('COUNT', col('id')), 'total_orders']
        ],
        include: [
            {
            model: Customer,
            attributes: ['id', 'firstname', 'lastname', 'email'],
            as: 'customer',
            required: true,
            }
        ],
        group: ['customer_id'],
        order: [['total_orders', 'DESC']],
        limit: 10, 
    });

    res.status(200).json({ success: true, topCustomers })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server Error' });
  }
};