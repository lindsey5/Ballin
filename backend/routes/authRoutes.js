import express from 'express';
import { customerLogin, customerSignup, signupSendVerification } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup/verification', signupSendVerification);
router.post('/signup', customerSignup);
router.post('/login', customerLogin);

const productRoutes = router

export default productRoutes;