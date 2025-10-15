import { emitLowStockNotification, emitNotification } from '../sockets/notificationSocket.js';
import Admin from '../models/Admin.js';
import LowStockNotification from '../models/LowStockNotification.js';
import { AdminNotification, Customer } from '../models/index.js';
import CustomerNotification from '../models/CustomerNotification.js';

export const sendLowStockNotification = async (product_name, variant_id, sku, prev_stock, current_stock) => {
    try{
        const admins = await Admin.findAll()

        for(const admin of admins){
            const notification = new LowStockNotification({
                message: `${product_name}: ${sku} dropped from ${prev_stock} to ${current_stock} units`,
                variant_id,
                admin_id: admin.id
            })

            await notification.save();

            emitLowStockNotification(notification, admin.id);
        }

    }catch(err){
        throw new Error(err.message)
    }
}

export const sendAdminNotification = async (customer_id, order_id, message) => {
    try{
        const admins = await Admin.findAll()

        for(const admin of admins){
            const notification = new AdminNotification({
                message,
                order_id,
                customer_id,
                admin_id: admin.id
            })

            await notification.save();

            const newNotification = await AdminNotification.findOne({
                where: { id: notification.id},
                include: [{ model: Customer }]
            });

            emitNotification(newNotification, admin.id);
        }

    }catch(err){
        throw new Error(err.message)
    }
}

export const sendCustomerNotification = async (customer_id, order_id, prev_status, current_status) => {
    try{
        const notification = await CustomerNotification.create({
            message: `Your order has been updated from ${prev_status} to ${current_status}`,
            order_id,
            customer_id,
        })

        emitNotification(notification, customer_id);
    }catch(err){
        throw new Error(err.message)
    }
}