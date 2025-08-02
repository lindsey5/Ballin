import express from 'express';
import { signup, signupSendVerification } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup/verification', signupSendVerification);
router.post('/signup', signup);

const productRoutes = router

export default productRoutes;