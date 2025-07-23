import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const Thumbnail = sequelize.define('thumbnail', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: { isInt: { msg: 'product_id must be an integer' }, },
        min: 1
    },
    thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'thumbnailUrl cannot be empty' } }
    }, 
    thumbnailPublicId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'thumbnailPublicId cannot be empty' }, }
    },
    }, {
    timestamps: false,
}

);

export default Thumbnail;