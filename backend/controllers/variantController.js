import { Variant, Product, Thumbnail } from '../models/index.js';
import { Op } from 'sequelize';

export const get_low_stock_variants = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.searchTerm || '';
        const category = req.query.category || 'All';

        let variantWhere = {
            stock: { [Op.lte]: 10 } 
        };

        let productWhere = {
            status: 'Available',
        };

        if (searchTerm) {
            variantWhere = {
                ...variantWhere,
                sku: { [Op.like]: `%${searchTerm}%` }
            };
        }

        if (category !== 'All') {
            productWhere = {
                ...productWhere,
                category: { [Op.like]: `%${category}%` }
            };
        }

        const query = {
            limit,
            offset,
            where: variantWhere,
            include: [
                {
                    model: Product,
                    required: true, 
                    where: productWhere,
                    include: [
                        { model: Thumbnail, required: false }
                    ]
                },
            ],
            order: [['stock', 'ASC']], 
        };

        // 🔹 Fetch results and total count
        const [variants, total] = await Promise.all([
            Variant.findAll(query),
            Variant.count({
                where: variantWhere,
                include: [
                    {
                        model: Product,
                        required: true,
                        where: productWhere
                    }
                ]
            })
        ]);

        // 🔹 Return data
        res.status(200).json({
            success: true,
            variants,
            total,
            totalPages: Math.ceil(total / limit),
            page
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

export const add_variant_stock = async(req, res) => {
    try{
        const variant = await Variant.findByPk(req.params.id);

        if(!variant){
            return res.status(404).json({ error: 'Variant not found.'})
        }

        variant.stock = variant.stock + Number(req.body.quantity)

        await variant.save();
        res.status(200).json({ success: true, message: 'Variant stock successfully updated.'})

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}
