import express from 'express';
import { add_variant_stock, get_variants } from '../controllers/variantController.js';
import { adminRequireAuth } from '../middlewares/authRequire.js';
const router = express.Router();

router.get('/', adminRequireAuth, get_variants);
router.put('/:id', add_variant_stock);

const variantRoutes = router

export default variantRoutes;