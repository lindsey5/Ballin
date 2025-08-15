import express from 'express';
import { customerRequireAuth } from '../middlewares/authRequire.js';
import { createNewOrder, get_all_orders, get_order_by_id } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', customerRequireAuth, createNewOrder)
router.get('/', get_all_orders)
router.get('/:id', get_order_by_id)

const orderRoutes = router

export default orderRoutes;