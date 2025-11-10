import { Op } from "sequelize";
import Admin from "../models/Admin.js";
import { verifyPassword, createToken } from "../utils/authUtils.js";
import { logoutUser } from "../sockets/notificationSocket.js";

const maxAge = 1 * 24 * 60 * 60; 

export const createAdmin = async (req, res) => {
    try{
        const isOwner = await Admin.findOne({
            where: {
                id: req.user_id,
                role: 'Owner'
            }
        });

        if(!isOwner){
            return res.status(401).json({ error: 'Unauthorized.' })
        }

        const isEmailExist = await Admin.findOne({ where: { email: req.body.email }})

        if(isEmailExist){
            return res.status(409).json({ error: 'Email already exist'});
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,32}$/;
        if (!passwordRegex.test(req.body.password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character' 
            });
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

export const getAdmins = async (req, res) => {
    try{
        const searchTerm = req.query.searchTerm;
        const isOwner = await Admin.findOne({
            where: {
                id: req.user_id,
                role: 'Owner'
            }
        });

        if(!isOwner){
            return res.status(401).json({ error: 'Unauthorized.' })
        }

        let whereCondition = {
            role: 'Admin'
        }

        if(searchTerm){
            whereCondition = {
                ...whereCondition,
                [Op.or] : {
                    firstname: { [Op.like]: `%${searchTerm}%` },
                    lastname: { [Op.like]: `%${searchTerm}%` },
                    email: { [Op.like]: `%${searchTerm}%` }
                }
            }
        }

        const admins = await Admin.findAll({
            where: whereCondition
        });

        res.status(200).json({ success: true, admins });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

export const updateAdmin = async (req, res) => {
    try{
        const isOwner = await Admin.findOne({
            where: {
                id: req.user_id,
                role: 'Owner'
            }
        });

        if(!isOwner){
            return res.status(401).json({ error: 'Unauthorized.' })
        }

        const isEmailExist = await Admin.findOne({ where: { email: req.body.email, id: { [Op.ne] : req.params.id } }})

        if(isEmailExist){
            return res.status(409).json({ error: 'Email already exist'});
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,32}$/;
        if (req.body.password && !passwordRegex.test(req.body.password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character' 
            });
        }

        const admin = await Admin.findByPk(req.params.id);

        if(!admin){
            return res.status(404).json({ error: 'Admin not found.'});
        }

        admin.set(req.body);
        await admin.save();

        res.status(200).json({ success: true, message: 'Admin successfully updated'});

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

export const deleteAdmin = async (req, res) => {
    try{
        const isOwner = await Admin.findOne({
            where: {
                id: req.user_id,
                role: 'Owner'
            }
        });

        if(!isOwner){
            return res.status(401).json({ error: 'Unauthorized.' })
        }

        const admin = await Admin.findByPk(req.params.id);
        if(!admin){
            return res.status(404).json({ error: 'Admin not found'});
        }

        await admin.destroy();
        logoutUser(admin.id)
        res.status(200).json({ success: true, message: 'Admin successfully deleted.'})
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}