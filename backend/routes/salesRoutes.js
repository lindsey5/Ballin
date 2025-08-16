import express from 'express';
import { getSalesPerMonth, getSalesThisMonth, getSalesToday, getTopProducts } from '../controllers/salesController.js';
const router = express.Router();

router.get('/today', getSalesToday);
router.get('/month', getSalesThisMonth);
router.get('/per-month', getSalesPerMonth);
router.get('/top-products', getTopProducts);

const salesRoutes = router

export default salesRoutes;