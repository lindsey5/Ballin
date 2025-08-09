import { createOrder } from "../services/orderService.js";

export const createNewOrder = async (req, res) => {
    try{
        const { address, payment_details, items } = req.body;
        const { subtotal, shipping_fee, total, } = payment_details;
        const { firstname, lastname, ...rest } = address;

        const fullAddress = { fullname: `${firstname} ${lastname}`, ...rest }

        const order = await createOrder(req, {
            address: fullAddress,
            subtotal,
            total,
            shipping_fee,
            items,
            payment_method: 'COD'
        })

        res.status(201).json({ success: true, order });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}