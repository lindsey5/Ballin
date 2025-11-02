import express from 'express';
import { changeCustomerPassword, getAllCustomers, getCustomer, getTopCustomers, updateCustomer } from '../controllers/customerController.js';
import { adminRequireAuth, customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.get('/', customerRequireAuth, getCustomer);
router.get('/all', adminRequireAuth, getAllCustomers);
router.get('/top', adminRequireAuth, getTopCustomers);
router.put('/', customerRequireAuth, updateCustomer);
router.put('/password', customerRequireAuth, changeCustomerPassword);

const productRoutes = router;

export default productRoutes;