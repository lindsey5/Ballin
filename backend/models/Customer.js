import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';
import { hashPassword } from '../utils/authUtils.js';

const Customer = sequelize.define('customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'firstname cannot be empty' } }
    }, 
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'lastname cannot be empty' },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'email cannot be empty' },
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'password cannot be empty' },
        }
    }
    }, {
    timestamps: false,
    hooks: {
        beforeCreate: async (account, options) => {
            console.log('account about to be created & saved:', account);

            if (account.password) {
                console.log(account.password)
                account.password = await hashPassword(account.password);
            }
        },
    }
}

);


export default Customer;