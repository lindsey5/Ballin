import express from 'express';
import { paypal_capture_order, paypal_create_order } from '../controllers/paypalController.js';
import { customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.post('/create-order', customerRequireAuth, paypal_create_order);
router.post('/capture-order', customerRequireAuth, paypal_capture_order);

export default router