import { Op } from 'sequelize';
import { Cart, Order, OrderAddress, OrderItem, Variant } from '../models/index.js'

export const generateOrderId = async () => {
  const prefix = 'ORDER-';
  const order_id = prefix + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const existingOrder = await Order.findByPk(order_id)

  // If it exists, retry
  if (existingOrder) {
    return generateOrderId();
  }

  return order_id;
};

export const createOrder = async (req, newOrder) => {
    try{
        const { items, shipping_fee, subtotal, total, address, payment_method } = newOrder;

        const order = await Order.create({
            order_id: await generateOrderId(),
            customer_id: req.user_id,
            subtotal, 
            shipping_fee,
            total,
            payment_method
        })

        if(!order) throw new Error('Order creation failed');

        const orderItems = items.map(item => ({
            product_id: item.product_id,
            order_id: order.dataValues.order_id,
            size: item.variant.size,
            color: item.variant.color,
            price: item.variant.price,
            quantity: item.quantity,
            total: item.quantity * item.variant.price
        }))

        await OrderItem.bulkCreate(orderItems, {
            validate: true
        });

        await OrderAddress.create({...address, order_id: order.dataValues.order_id});

        const cartIds = items.map(item => item.id)

        await Cart.destroy({
            where: { id: { [Op.in] : cartIds } },   
        });

        return order

    }catch(err){
        throw new Error(err.message)
    }
}