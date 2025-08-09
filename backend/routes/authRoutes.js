import express from 'express';
import { customerLogin, customerSignup, logout, signupSendVerification } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup/verification', signupSendVerification);
router.post('/signup', customerSignup);
router.post('/login', customerLogin);
router.post('/logout', logout);

const productRoutes = router

export default productRoutes;