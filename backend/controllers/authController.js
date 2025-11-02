import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";
import { sendVerificationCode } from "../services/emailService.js";
import jwt from 'jsonwebtoken'
import { verifyPassword, createToken} from "../utils/authUtils.js";

const maxAge = 1 * 24 * 60 * 60; 

export const signupSendVerification = async (req, res) => {
    try{
        const { email, password } = req.body
        const isExist = await Customer.findOne({ where: { email: email } })
        if(isExist){
            return res.status(409).json({ error: 'Email is already used'})
        }
        if(password.length < 6){
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        if(password.length > 32){
            return res.status(400).json({ error: 'Password must not exceed 32 characters' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,32}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character' 
            });
        }

        const verificationCode = await sendVerificationCode(email);

        if(!verificationCode){
            throw new Error("Failed to send verification code");
        }

        const token = createToken(verificationCode)

        res.cookie('verification', token, {
            httpOnly: true,
            maxAge: 5 * 60 * 1000,     
            sameSite: 'none',     
            secure: true       
        });

        res.status(200).json({ success: true, message: "Verification code sent"});

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

export const customerLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        const customer = await Customer.findOne({ where: { email, status: 'Active' } });
        
        if(!customer){
            res.status(404).json({ error: "Email not found"})
        }

        const isMatch = await verifyPassword(password, customer.password);
  
        if (!isMatch) {
            res.status(401).json({ error: 'Incorrect Password'})
            return;
        }
        const token = createToken(customer.id);
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

export const customerSignup = async (req, res) => {
    try{
        const { code, customer } = req.body; 
        const isExist = await Customer.findOne({ where: { email: customer.email } })
        if(isExist){
            return res.status(409).json({ error: 'Email is already used'})
        }
        const { password } = customer;
        if(password.length < 6){
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        if(password.length > 32){
            return res.status(400).json({ error: 'Password must not exceed 32 characters' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,32}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character' 
            });
        }

        const codeToken = req.cookies?.verification;

        const decodedCode = jwt.verify(codeToken, process.env.JWT_SECRET)

        if(!decodedCode.id || Number(code) !== decodedCode.id){
            return res.status(401).json({ error: 'Incorrect code'})
        }

        const newCustomer = await Customer.create(customer);

        res.clearCookie('verification', { httpOnly: true, secure: true });

        const token = createToken(newCustomer.dataValues.id)

        res.cookie('jwt', token, {
            httpOnly: true,
            mmaxAge: maxAge * 1000,
            sameSite: 'none',     
            secure: true       
        });

        res.status(201).json({ success: true, customer: newCustomer });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

export const logout = (req, res) =>{
    res.clearCookie('jwt', { httpOnly: true, secure: false });
    res.redirect('/');
}

export const getUser = async (req, res) => {
  try{
    const token = req.cookies?.jwt;

    if (!token) {
        res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
        return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const customer = await Customer.findByPk(decoded.id);
    const admin = await Admin.findByPk(decoded.id);

    if(!customer && !admin) {
       res.status(404).json({ success: false, message: 'User not found' });
       return;
    }
    
    if(customer){
      res.status(200).json({ success : true, user: { ...customer.toJSON(), role: 'Customer'}})
    }else if(admin) {
      res.status(200).json({ success : true, user: admin})
    }

  }catch(err){
    console.log(err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
}