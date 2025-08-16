import express from 'express';
import { getAllCustomers, getCustomer } from '../controllers/customerController.js';
import { customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.get('/', customerRequireAuth, getCustomer);
router.get('/all', getAllCustomers);

const productRoutes = router;

export default productRoutes;