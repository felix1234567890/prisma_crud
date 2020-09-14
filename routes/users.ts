import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';
import UserController from '../controllers/user.controller';
import { container } from 'tsyringe';
import { cache } from 'utils/redis';
import isAuthenticated from '../utils/isAuthenticated';

const userController = container.resolve(UserController);

const router = Router();

router.route('/').get(asyncHandler(userController.paginateUsers));
router
  .route('/:id')
  .get(asyncHandler(userController.findUser))
  .put(asyncHandler(userController.updateUser))
  .delete(asyncHandler(userController.deleteUser));

router.get(
  '/:id/books',
  isAuthenticated,
  cache,
  asyncHandler(userController.getUserBooks),
);

router.get('/:id/reviews', asyncHandler(userController.getUserReviews));

export default router;
