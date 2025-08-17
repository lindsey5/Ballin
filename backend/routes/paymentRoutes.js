import express from 'express';
import { customerRequireAuth } from '../middlewares/authRequire.js';
import { createPaymentCheckout, paymongoWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/checkout', customerRequireAuth, createPaymentCheckout);
router.post('/webhook', paymongoWebhook)

const paymentRoutes = router

export default paymentRoutes;