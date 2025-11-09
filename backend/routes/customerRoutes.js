import express from 'express';
import { activateCustomerAccount, changeCustomerPassword, deactivateCustomerAccount, getAllCustomers, getCustomer, getTopCustomers, getTotalCustomers, updateCustomer } from '../controllers/customerController.js';
import { adminRequireAuth, customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.get('/', customerRequireAuth, getCustomer);
router.get('/all', adminRequireAuth, getAllCustomers);
router.get('/top', adminRequireAuth, getTopCustomers);
router.get('/total', adminRequireAuth, getTotalCustomers);
router.put('/', customerRequireAuth, updateCustomer);
router.put('/activate/:id', adminRequireAuth, activateCustomerAccount);
router.put('/deactivate/:id', adminRequireAuth, deactivateCustomerAccount);
router.put('/password', customerRequireAuth, changeCustomerPassword);

const productRoutes = router;

export default productRoutes;