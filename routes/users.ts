import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';
import UserController from '../controllers/users.controller';
import { container } from 'tsyringe';

const userController = container.resolve(UserController);

const router = Router();

router.route('/').get(asyncHandler(userController.paginateUsers));
router
  .route('/:id')
  .get(userController.findUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.get('/:id/books', asyncHandler(userController.getUserBooks));

router.get('/:id/reviews', asyncHandler(userController.getUserReviews));

export default router;
