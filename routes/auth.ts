import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from 'index';
import bcrypt from 'bcrypt';
import AppError from 'utils/AppError';
import { container } from 'tsyringe';
import { IAuthService } from 'utils/JwtAuthService';
import UserController from 'controllers/users.controller';
import asyncHandler from 'utils/asyncHandler';

const userController = container.resolve(UserController);
const jwtService = container.resolve<IAuthService>('AuthService');

const router = Router();
router.route('/register').post(asyncHandler(userController.createUser));
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await prisma.user.findOne({
      where: {
        email,
      },
    });
    if (!user) return res.status(404).send({ message: 'Not found' });
    if (!process.env.JWT_SECRET) throw new Error('Env variable not loaded');
    const isMatch = bcrypt.compareSync(password, user?.password);
    if (isMatch) {
      const token = jwtService.authenticateUser(user);
      res.status(200).json({ token });
    } else {
      const error = new AppError('Passwords dont match');
      next(error);
    }
  },
);
export default router;
