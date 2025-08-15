import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Order = sequelize.define('order', {
    order_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(
            'Pending',
            'Confirmed',
            'Shipped',
            'Delivered',
            'Completed',
            'Cancelled',
            'Rejected',
            'Refunded',
            'Failed'
        ),
        allowNull: false,
        defaultValue: 'Pending'
    },
    payment_method: {
        type: DataTypes.ENUM('COD', 'PAYPAL'),
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    shipping_fee: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    order_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

export default Order;
