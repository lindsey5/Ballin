import express from 'express';
import { adminLogin, createAdmin, deleteAdmin, getAdmins, updateAdmin } from '../controllers/adminController.js';
import { adminRequireAuth } from '../middlewares/authRequire.js';
const router = express.Router();

router.post('/', adminRequireAuth, createAdmin);
router.get('/', adminRequireAuth, getAdmins);
router.post('/login', adminLogin);
router.put('/:id', adminRequireAuth, updateAdmin);
router.delete('/:id', adminRequireAuth, deleteAdmin);

const adminRoutes = router

export default adminRoutes;