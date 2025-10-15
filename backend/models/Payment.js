import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Payment = sequelize.define('payment', {
    payment_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Refunded', 'Paid'),
        allowNull: false,
        defaultValue: 'Paid'
    }
}, {
    timestamps: false,
});

export default Payment;
