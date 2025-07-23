import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const ProductImage = sequelize.define('product_image', {
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
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'imageUrl cannot be empty' } }
    }, 
    imagePublicId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'imagePublicId cannot be empty' }, }
    },
    }, {
    timestamps: false,
    tableName: 'product_images'
}

);

export default ProductImage;