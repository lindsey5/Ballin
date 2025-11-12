import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';

const ResetToken = sequelize.define('reset_token', {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    }, {
    timestamps: false,
}
);


export default ResetToken;