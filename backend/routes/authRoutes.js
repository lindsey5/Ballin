import express from 'express';
import { customerLogin, customerSignup, forgotPassword, getUser, logout, resetPassword, signupSendVerification } from '../controllers/authController.js';

const router = express.Router();

router.get('/user', getUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/signup/verification', signupSendVerification);
router.post('/signup', customerSignup);
router.post('/login', customerLogin);
router.post('/logout', logout);

const authRoutes = router

export default authRoutes;