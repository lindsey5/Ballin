import { Cart, Product, Variant } from '../models/index.js'

export const createCartItem = async (req, res) => {
    try {
        const { product_id, variant_id, quantity } = req.body;
        const customer_id = req.user_id;

        const cart = await Cart.findOne({ 
            where: {
                product_id,
                variant_id,
                customer_id
            }
        });

        if (cart) {
            cart.quantity += quantity;
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
                    required: false,
                },
                {
                    model: Variant,
                    required: false

                },
            ]
        })

        res.status(200).json({ success: true, cart });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}