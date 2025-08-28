import express from 'express';
import { getAllCustomers, getCustomer } from '../controllers/customerController.js';
import { adminRequireAuth, customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.get('/', customerRequireAuth, getCustomer);
router.get('/all', adminRequireAuth, getAllCustomers);

const productRoutes = router;

export default productRoutes;