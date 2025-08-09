import express from 'express';
import { createCartItem, deleteCartItem, getCart, updateCartQuantity } from '../controllers/cartController.js';
import { customerRequireAuth } from '../middlewares/authRequire.js';

const router = express.Router();

router.post('/', customerRequireAuth, createCartItem);
router.get('/', customerRequireAuth, getCart);
router.put('/:id', customerRequireAuth, updateCartQuantity);
router.delete('/:id', customerRequireAuth, deleteCartItem);

const cartRoutes = router

export default cartRoutes;