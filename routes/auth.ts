import { Router } from 'express';
import { container } from 'tsyringe';
import asyncHandler from 'utils/asyncHandler';
import AuthController from 'controllers/auth.controller';

const authController = container.resolve(AuthController);

const router = Router();

router.route('/register').post(asyncHandler(authController.registerUser));
router.post('/login', asyncHandler(authController.loginUser));
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

export default router;
