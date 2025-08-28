import express from 'express';
import { getSalesPerMonth, getSalesThisMonth, getSalesToday, getTopProducts } from '../controllers/salesController.js';
import { adminRequireAuth } from '../middlewares/authRequire.js';


const router = express.Router();

router.get('/today', adminRequireAuth, getSalesToday);
router.get('/month', adminRequireAuth, getSalesThisMonth);
router.get('/per-month', adminRequireAuth, getSalesPerMonth);
router.get('/top-products', adminRequireAuth, getTopProducts);

const salesRoutes = router

export default salesRoutes;