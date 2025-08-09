import express from 'express';
import { customerRequireAuth } from '../middlewares/authRequire.js';
import { createNewOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', customerRequireAuth, createNewOrder)

const orderRoutes = router

export default orderRoutes;