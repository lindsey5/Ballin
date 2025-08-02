import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';
import Product from './Product.js';

//id	product_id	sku	price	stock	size	color	
const Variant = sequelize.define('variant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: { msg: 'product_id must be an integer' }, },
        min: 1
    }, 
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'sku cannot be empty' }, },
        unique: true
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { isFloat: { msg: 'price must be a float' }, },
        min: 1
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: { msg: 'stock must be an integer' }, },
        min: 0
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'color cannot be empty' }, }
    },
    }, {
    timestamps: false,
}

);

export default Variant;