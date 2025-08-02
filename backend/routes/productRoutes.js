import express from 'express';
import { create_product, delete_product, get_all_products, get_product_by_id, update_product } from '../controllers/productController.js';

const router = express.Router();

router.post('/', create_product);
router.get('/', get_all_products);
router.get('/:id', get_product_by_id);
router.put('/:id', update_product);
router.delete('/:id', delete_product);

const productRoutes = router

export default productRoutes;