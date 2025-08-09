import Cart from './Cart.js';
import Customer from './Customer.js';
import Order from './Order.js';
import OrderAddress from './OrderAddress.js';
import OrderItem from './OrderItem.js';
import Product from './Product.js';
import ProductImage from './ProductImage.js';
import Thumbnail from './Thumbnail.js';
import Variant from './Variant.js';

Product.hasMany(Variant, { foreignKey: 'product_id' });
Product.hasOne(Thumbnail, { foreignKey: 'product_id' });
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });

Variant.belongsTo(Product, { foreignKey: 'product_id' });
Thumbnail.belongsTo(Product, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Cart.belongsTo(Product, { foreignKey: 'product_id' });
Cart.belongsTo(Customer, { foreignKey: 'customer_id'});
Cart.belongsTo(Variant, { foreignKey: 'variant_id'});

Order.hasOne(OrderAddress, { foreignKey: 'order_id'});
Order.hasMany(OrderItem, { foreignKey: 'order_id'});

export { Product, Variant, Thumbnail, ProductImage, Cart, Order, OrderAddress, OrderItem };