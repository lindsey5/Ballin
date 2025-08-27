import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const OrderAddress = sequelize.define('orderaddress', {
    order_id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
    },
    fullname: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    address_line_1: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    address_line_2: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    admin_area_1: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    admin_area_2: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    postal_code: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
}, {
    timestamps: false,
});

export default OrderAddress;
