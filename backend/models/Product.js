import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

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
    },
    status: {
        type: DataTypes.ENUM('Available', 'Deleted'),
        allowNull: false,
        defaultValue: 'Available',
        
    }
    }, {
    timestamps: false,
}

);


export default Product;