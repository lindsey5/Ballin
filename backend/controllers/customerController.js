import { Customer, Order } from '../models/index.js';
import { fn, col, Op } from 'sequelize';
import { verifyPassword, hashPassword } from '../utils/authUtils.js';
import { deactivateUser } from '../sockets/notificationSocket.js';

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

export const updateCustomer = async (req, res) => {
    try{
        const customer = await Customer.findByPk(req.user_id);
        if(!customer){
            return  res.status(404).json({ error: 'Customer not found'});
        }
        const { firstname, lastname, email } = req.body;
        customer.firstname = firstname;
        customer.lastname = lastname;
        customer.email = email;
        await customer.save();
        res.status(200).json({ success: true, message: 'Customer updated successfully', customer });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

export const getAllCustomers = async (req, res) => {
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const status = req.query.status;

        // search term
        const search = req.query.search || "";

        let whereCondition = search
        ? {
            [Op.or]: [
                { email: { [Op.like]: `%${search}%` } },
                { firstname: { [Op.like]: `%${search}%` } },
                { lastname: { [Op.like]: `%${search}%` } },
            ],
            }
        : {};

        if(status && status !== 'All')[
            whereCondition = {
                ...whereCondition,
                status
            }
        ]

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

export const changeCustomerPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        if(newPassword.length < 6){
            return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }

        if(newPassword.length > 32){
            return res.status(400).json({ error: 'New password must not exceed 32 characters' });
        }

        if(newPassword === currentPassword){
            return res.status(400).json({ error: 'New password must be different from current password' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,32}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                error: 'New Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character' 
            });
        }
        
        const customer = await Customer.findByPk(req.user_id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const isMatch = await verifyPassword(currentPassword, customer.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        customer.password = await hashPassword(newPassword);
        await customer.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Server Error' });
    }
};

export const deactivateCustomerAccount = async (req, res) => {
    try{
        const customer = await Customer.findByPk(req.params.id);
        if(!customer){
            return res.status(404).json({ error: 'Customer not found.'})
        }

        customer.status = 'Deactivated';

        await customer.save();

        deactivateUser(customer.id);

        res.status(200).json({ success: true, message: 'Customer successfully deactivated.'})

    } catch (err) {
        res.status(500).json({ error: err.message || 'Server Error' });
    }
};

export const activateCustomerAccount = async (req, res) => {
    try{
        const customer = await Customer.findByPk(req.params.id);
        if(!customer){
            return res.status(404).json({ error: 'Customer not found.'})
        }

        customer.status = 'Active';

        await customer.save();

        res.status(200).json({ success: true, message: 'Customer status successfully changed to active.'})

    } catch (err) {
        res.status(500).json({ error: err.message || 'Server Error' });
    }
};

export const getTotalCustomers = async (req, res) => {
    try{
        const totalCustomers = await Customer.count();

        res.status(200).json({ success: true, totalCustomers });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}