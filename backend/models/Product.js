import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';
import Variant from './Variant.js';

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Product name cannot be empty' } }
    }, 
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'description cannot be empty' },
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'description cannot be empty' },
        }
    }
    }, {
    timestamps: false,
}

);


export default Product;