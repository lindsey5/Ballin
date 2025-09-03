import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const CustomerNotification = sequelize.define('customer_notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('read', 'unread'),
        defaultValue: 'unread'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    }, {
    timestamps: false,
}
);


export default CustomerNotification;