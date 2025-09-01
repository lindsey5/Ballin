import Notification from '../models/LowStockNotification.js';
import { emitLowStockNotification } from '../sockets/notificationSocket.js';
import Admin from '../models/Admin.js';

export const sendLowStockNotification = async (product_name, product_id, sku, prev_stock, current_stock) => {
    try{
        const admins = await Admin.findAll()

        for(const admin of admins){
            const notification = new Notification({
                message: `${product_name}: ${sku} dropped from ${prev_stock} to ${current_stock} units`,
                product_id,
                admin_id: admin.id
            })

            await notification.save();

            emitLowStockNotification(notification, admin.id);
        }

    }catch(err){
        throw new Error(err.message)
    }
}