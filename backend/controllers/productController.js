import { Product, Variant, ProductImage, Thumbnail } from '../models/index.js';
import { deleteImage, uploadImage } from '../config/cloudinary.js';
import { error } from 'console';

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

        res.status(201).json({...newProduct.dataValues, images: newImages, variants: newVariants, thumbnail: newThumbnail });
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

        res.status(200).json(product);

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

        oldProduct.set(product)
        await oldProduct.save()

        const existedThumbnail = await Thumbnail.findByPk(product_id);

        if(existedThumbnail && thumbnail.thumbnailUrl !== existedThumbnail.thumbnailUrl){
            await deleteImage(existedThumbnail.dataValues.thumbnailPublicId)
            const thumbnailObject = await uploadImage(thumbnail.thumbnailUrl);
            existedThumbnail.set({thumbnailUrl: thumbnailObject.imageUrl, thumbnailPublicId: thumbnailObject.imagePublicId})
            await existedThumbnail.save()
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

        if(imagesToDelete){
            await Promise.all(imagesToDelete.map(async (image) => {
                await deleteImage(image.imagePublicId)
                await ProductImage.destroy({
                    where: { id: image.id }
                });
        }))
        }

        res.status(201).json({...oldProduct.toJSON(), images: updatedImages, variants: updatedVariants, thumbnail: existedThumbnail });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}
