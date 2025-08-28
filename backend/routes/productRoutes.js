import express from 'express';
import { create_product, delete_product, get_all_products, get_product_by_id, get_total_products, update_product } from '../controllers/productController.js';
import { adminRequireAuth, } from '../middlewares/authRequire.js';
const router = express.Router();

router.post('/', adminRequireAuth, create_product);
router.get('/', get_all_products);
router.get('/total', adminRequireAuth, get_total_products);
router.get('/:id', get_product_by_id);
router.put('/:id', adminRequireAuth, update_product);
router.delete('/:id', adminRequireAuth, delete_product);

const productRoutes = router

export default productRoutes;