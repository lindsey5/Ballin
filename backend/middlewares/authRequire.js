import Customer from "../models/Customer.js";
import jwt from 'jsonwebtoken'

export const customerRequireAuth = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user_id = decoded.id;

    const user = await Customer.findByPk(req.user_id)
    if (!user) {
      res.status(401).json({ success: false, message: 'Customer doesn\'t exist.' });
      return;
    }

    next(); 
  } catch (error) {
    console.log(error)
    res.status(403).json({ error: error.message });
  }
};