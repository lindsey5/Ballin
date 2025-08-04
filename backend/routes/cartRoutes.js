import express from 'express';
import { createCartItem, getCart } from '../controllers/cartController.js';
import { customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.post('/', customerRequireAuth, createCartItem);
router.get('/', customerRequireAuth, getCart);

const cartRoutes = router

export default cartRoutes;