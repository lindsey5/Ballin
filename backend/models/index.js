import Product from './Product.js';
import ProductImage from './ProductImage.js';
import Thumbnail from './Thumbnail.js';
import Variant from './Variant.js';

Product.hasMany(Variant, { foreignKey: 'product_id' });
Product.hasOne(Thumbnail, { foreignKey: 'product_id' });
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images'});

Variant.belongsTo(Product, { foreignKey: 'product_id' });
Thumbnail.belongsTo(Product, { foreignKey: 'product_id'});
ProductImage.belongsTo(Product, { foreignKey: 'product_id'});

export { Product, Variant, Thumbnail, ProductImage };