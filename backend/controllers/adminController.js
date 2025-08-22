import Admin from "../models/Admin.js";
import { verifyPassword, createToken } from "../utils/authUtils.js";

const maxAge = 1 * 24 * 60 * 60; 

export const createAdmin = async (req, res) => {
    try{
        const isEmailExist = await Admin.findOne({ where: { email: req.body.email }})

        if(isEmailExist){
            return res.status(409).json({ error: 'Email already exist'});
        }
        const admin = new Admin(req.body)

        await admin.save();

        res.status(201).json({ success: true, admin });

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const adminLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        console.log(req.body)
        const admin = await Admin.findOne({ where: { email} });

        if(!admin){
            res.status(404).json({ error: "Email not found"})
        }

        const isMatch = await verifyPassword(password, admin.password);
  
        if (!isMatch) {
            res.status(401).json({ error: 'Incorrect Password'})
            return;
        }
        const token = createToken(admin.id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            sameSite: 'none',      
            secure: true        
        });

        res.status(201).json({ success: true })
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}