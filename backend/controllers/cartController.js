import { Cart, Product, Thumbnail, Variant } from '../models/index.js'
import { Op } from 'sequelize';

export const createCartItem = async (req, res) => {
    try {
        const { product_id, variant_id, quantity } = req.body;
        const customer_id = req.user_id;
        const product = await Product.findByPk(product_id);
        if(product.status === 'Deleted'){
            return res.status(400).json({ error: 'This product is already deleted. Please select another product' })
        }

        const variant = await Variant.findByPk(variant_id);

        if (variant.stock <= 0) {
            return res.status(400).json({ error: 'This item is currently unavailable' });
        }

        const cart = await Cart.findOne({ 
            where: {
                product_id,
                variant_id,
                customer_id
            }
        });

        if (cart) {
            let newQuantity = cart.quantity + quantity;

            if (newQuantity > variant.stock) {
                newQuantity = variant.stock;
            }

            cart.quantity = newQuantity;

            await cart.save();

            return res.status(200).json({ success: true, cart });
        }

        // Create a new cart item
        const newCart = await Cart.create({
            product_id,
            variant_id,
            quantity,
            customer_id
        });

        res.status(201).json({ success: true, cart: newCart });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};


export const getCart = async (req, res) => {
    try{
        const customer_id = req.user_id
        const cart = await Cart.findAll({ 
            where: { customer_id }, 
            include: [
                { 
                    model: Product,
                    where: { status: { [Op.ne] : 'Deleted' }},
                    include: [
                        {
                            model: Thumbnail,
                            required: false
                        },
                    ],
                    required: true,
                },
                {
                    model: Variant,
                    required: false,
                    where:{
                        stock: { [Op.ne] : 0}
                    },
                    required: true
                }
            ]
        })

        res.status(200).json({ success: true, cart });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const updateCartQuantity = async (req, res) => {
    try{
        const { quantity } = req.body;
        if(!quantity) return res.status(400).json({ error: 'Quantity is required' });
        const cart = await Cart.findByPk(req.params.id)

        if(!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.quantity = quantity;

        await cart.save()
        res.status(200).json({ success: true, cart });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

export const deleteCartItem = async (req, res) => {
    try{
        const cart = await Cart.findByPk(req.params.id);

        if(!cart) return res.status(404).json({ error: 'Cart not found'});

        if(cart.dataValues.customer_id !== req.user_id) return res.status(403).json({ error: 'Not authorized to delete this item' });

        await cart.destroy();

        res.status(200).json({ success: true, message: 'Cart item successfully deleted'})

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}