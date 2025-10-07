import express from 'express';
import { adminLogin, createAdmin, getAdmins } from '../controllers/adminController.js';
const router = express.Router();

router.post('/', createAdmin);
router.get('/', getAdmins);
router.post('/login', adminLogin)

const adminRoutes = router

export default adminRoutes;