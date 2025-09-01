import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const LowStockNotification = sequelize.define('low_stock_notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    admin_id: {
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


export default LowStockNotification;