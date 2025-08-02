import { Product, Variant, ProductImage, Thumbnail } from '../models/index.js';
import { deleteImage, uploadImage } from '../config/cloudinary.js';
import { Op, literal } from 'sequelize';
import { sequelize } from '../config/connection.js';

export const create_product = async (req, res) => {
    const { product, variants, thumbnail, images } = req.body; 
    try{
        const newProduct = await Product.create(product);

        const product_id = newProduct.dataValues.id

        const newVariants =await Variant.bulkCreate(variants.map(v => ({...v, product_id })), {
            individualHooks: true
        });

        const thumbnailObject = await uploadImage(thumbnail.thumbnailUrl);

        const newThumbnail = await Thumbnail.create({ product_id, thumbnailUrl: thumbnailObject.imageUrl, thumbnailPublicId: thumbnailObject.imagePublicId})

        const newImages = await Promise.all(images.map(async (image) => {
            const imageObject =  await uploadImage(image.imageUrl);
            return await ProductImage.create({...imageObject, product_id})
        }))

        res.status(201).json({
            success: true,
            product: {...newProduct.dataValues, images: newImages, variants: newVariants, thumbnail: newThumbnail }
        });
    }catch(err){
        // Handle any errors that occur during the process
        res.status(500).json({ error: err.message }); // Respond an error message
    }
}

export const get_product_by_id = async (req, res) => {
    try{
        const product = await Product.findOne({
            where: { id: req.params.id },
            include: [
                { model: ProductImage, as: 'images'},
                { model: Variant },
                { model: Thumbnail }
            ]
        });
        if(!product){
            return res.status(404).json({ error: 'Product not found'});
        }

        res.status(200).json({ success: true, product });

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

export const update_product = async (req, res) => {
    const { product, variants, thumbnail, images, imagesToDelete } = req.body; 
    try{
        const product_id = req.params.id
        const oldProduct = await Product.findByPk(product_id);

        if(!oldProduct){
            return res.status(404).json({ error: 'Product not found'})
        }

        const updatedImages = await Promise.all(images.map(async (image) => {
            if(!image.id){
                const imageObject =  await uploadImage(image.imageUrl);
                return await ProductImage.create({...imageObject, product_id})
            }

            return image
        }))

        let updatedVariants = [];
        if (variants && Array.isArray(variants)) {
            await Variant.destroy({ where: { product_id } });
            updatedVariants = await Promise.all(
                variants.map(async (variant) => {
                    return await Variant.create({ ...variant, product_id });
                })
            );
        }

        oldProduct.set(product)
        await oldProduct.save()

        const existedThumbnail = await Thumbnail.findByPk(product_id);

        if(existedThumbnail && thumbnail.thumbnailUrl !== existedThumbnail.thumbnailUrl){
            await deleteImage(existedThumbnail.dataValues.thumbnailPublicId)
            const thumbnailObject = await uploadImage(thumbnail.thumbnailUrl);
            existedThumbnail.set({thumbnailUrl: thumbnailObject.imageUrl, thumbnailPublicId: thumbnailObject.imagePublicId})
            await existedThumbnail.save()
        }

        if(imagesToDelete){
            await Promise.all(imagesToDelete.map(async (image) => {
                await deleteImage(image.imagePublicId)
                await ProductImage.destroy({
                    where: { id: image.id }
                });
        }))
        }

        res.status(201).json({
            success: true,
            product: {...oldProduct.toJSON(), images: updatedImages, variants: updatedVariants, thumbnail: existedThumbnail }
        });
    }catch(err){
        if (err.name === 'SequelizeUniqueConstraintError') {
            err.message = 'SKU is already used'
        }
        res.status(500).json({ error: err.message });
    }
}

export const get_all_products = async (req, res) => {
    try{
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.searchTerm || '';
        const safeSearch = sequelize.escape(`%${searchTerm}%`);
        const category = req.query.category || 'All';

        let query = { 
            limit, 
            offset,
            where: { status: 'Available', category: { [Op.like] : `%${category && category !== 'All' ? category : ''}%`} },
            include: [
                {
                    model: Variant,
                    required: false 
                },
                {
                    model: Thumbnail,
                    required: false
                }
            ]
         }

        if (searchTerm) {
            query = {
                ...query,
                where: {
                    ...query.where,
                    [Op.or]: [
                        { product_name: { [Op.like]: `%${searchTerm}%` } },
                        { category: { [Op.like]: `%${searchTerm}%` } },
                        literal(`
                        EXISTS (
                            SELECT 1 FROM variants 
                            WHERE variants.product_id = product.id 
                            AND variants.sku LIKE ${safeSearch}
                        )
                        `)
                    ]
                },
            };
        }

        const [products, total] = await Promise.all([
            Product.findAll(query),
            Product.count(query)
        ])

        res.status(200).json({
            success: true,
            products,
            total: total,
            totalPages: Math.ceil(total / limit),
            page
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}


export const delete_product = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product doesn't exist" });
        }

        if (product.status === 'Deleted') {
            return res.status(400).json({ error: 'Product is already deleted' });
        }

        await product.update({ status: 'Deleted' });

        res.status(200).json({ success: true, message: 'Product successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};