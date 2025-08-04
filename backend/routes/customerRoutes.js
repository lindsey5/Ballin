import express from 'express';
import { getCustomer } from '../controllers/customerController.js';
import { customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.get('/', customerRequireAuth, getCustomer);

const productRoutes = router;

export default productRoutes;