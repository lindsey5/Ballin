import express from 'express';
import { adminLogin, createAdmin } from '../controllers/adminController.js';
import { adminRequireAuth } from '../middlewares/authRequire.js';
const router = express.Router();

router.post('/', adminRequireAuth, createAdmin);
router.post('/login', adminLogin)

const adminRoutes = router

export default adminRoutes;