import Customer from "../models/Customer.js";

export const getCustomer = async (req, res) => {
    try{
        const customer = await Customer.findByPk(req.user_id);
        if(!customer){
            res.status(404).json({ error: 'Customer not found'});
        }

        res.status(200).json({ success: true, customer });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}