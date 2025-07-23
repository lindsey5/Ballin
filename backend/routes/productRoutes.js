import express from 'express';
import { create_product, get_product_by_id, update_product } from '../controllers/productController.js';

const router = express.Router();

router.post('/', create_product);
router.get('/:id', get_product_by_id);
router.put('/:id', update_product);

const productRoutes = router

export default productRoutes;