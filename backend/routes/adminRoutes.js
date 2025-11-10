import express from 'express';
import { adminLogin, changeAdminPassword, createAdmin, deleteAdmin, getAdmins, updateAdmin, updateAdminProfile } from '../controllers/adminController.js';
import { adminRequireAuth } from '../middlewares/authRequire.js';
const router = express.Router();

router.post('/', createAdmin);
router.get('/', adminRequireAuth, getAdmins);
router.post('/login', adminLogin);
router.put('/', adminRequireAuth, updateAdminProfile);
router.put('/password', adminRequireAuth, changeAdminPassword);
router.put('/:id', adminRequireAuth, updateAdmin);
router.delete('/:id', adminRequireAuth, deleteAdmin);

const adminRoutes = router

export default adminRoutes;