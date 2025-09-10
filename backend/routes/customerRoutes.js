import express from 'express';
import { getAllCustomers, getCustomer, getTopCustomers } from '../controllers/customerController.js';
import { adminRequireAuth, customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.get('/', customerRequireAuth, getCustomer);
router.get('/all', adminRequireAuth, getAllCustomers);
router.get('/top', adminRequireAuth, getTopCustomers);

const productRoutes = router;

export default productRoutes;