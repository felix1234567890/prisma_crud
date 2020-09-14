import { Router } from 'express';
import isAuthenticated from '../utils/isAuthenticated';
import roleMiddleware from 'utils/roleMiddleware';
import { Role } from '@prisma/client';
import asyncHandler from 'utils/asyncHandler';
import BookController from 'controllers/book.controller';
import { container } from 'tsyringe';

const bookController = container.resolve(BookController);
const router = Router();
router
  .route('/')
  .get(
    isAuthenticated,
    roleMiddleware(Role.USER),
    asyncHandler(bookController.getBooks),
  )
  .post(isAuthenticated, asyncHandler(bookController.createBook));

router
  .route('/:bookId')
  .put(isAuthenticated, asyncHandler(bookController.updateBook))
  .get(isAuthenticated, asyncHandler(bookController.getBook))
  .delete(isAuthenticated, asyncHandler(bookController.deleteBook));

export default router;
