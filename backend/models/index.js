import Product from './Product.js';
import ProductImage from './ProductImage.js';
import Thumbnail from './Thumbnail.js';
import Variant from './Variant.js';

// Product has many variants and images, and one thumbnail
Product.hasMany(Variant, { foreignKey: 'product_id' });
Variant.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasOne(Thumbnail, { foreignKey: 'product_id' });
Thumbnail.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

export { Product, Variant, Thumbnail, ProductImage };