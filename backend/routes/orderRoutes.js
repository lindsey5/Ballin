import express from 'express';
import { customerRequireAuth } from '../middlewares/authRequire.js';
import { cancel_order, createNewOrder, get_all_orders, get_most_recent_orders, get_order_by_id, get_total_orders, update_order } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', customerRequireAuth, createNewOrder);
router.put('/:id/cancel', customerRequireAuth, cancel_order);
router.get('/', get_all_orders);
router.get('/customer', customerRequireAuth, get_all_orders);
router.get('/recent', get_most_recent_orders);
router.put('/:id', update_order);
router.get('/total', get_total_orders);
router.get('/:id', get_order_by_id);

const orderRoutes = router

export default orderRoutes;