import express from 'express';
import { adminLogin, createAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/', createAdmin);
router.post('/login', adminLogin)

const adminRoutes = router

export default adminRoutes;