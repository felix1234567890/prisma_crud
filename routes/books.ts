import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import isAuthenticated from '../utils/isAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import roleMiddleware from 'utils/roleMiddleware';
import { Role } from '@prisma/client';
import asyncHandler from 'utils/asyncHandler';
import BookController from 'controllers/book.controller';
import { container } from 'tsyringe';

const bookController = container.resolve(BookController);
const router = Router();
router.post('/', isAuthenticated, asyncHandler(bookController.createBook));

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const book = await prisma.book.findOne({
    where: { id: +req.params.id },
    include: { author: true },
  });
  if (!book) return res.status(404).json({ error: 'Not found' });
  if (book.authorId !== +req.user.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }

  const updatedBook = await prisma.book.update({
    where: {
      id: +req.params.id,
    },
    data: {
      description: req.body.description,
      title: req.body.title,
      yearPublished: req.body.yearPublished,
    },
    include: {
      author: true,
    },
  });
  return res.status(200).json(updatedBook);
});

router.get(
  '/',
  isAuthenticated,
  roleMiddleware([Role.ADMIN, Role.USER]),
  async (req: Request, res: Response) => {
    const books = await prisma.book.findMany({
      include: {
        author: true,
      },
    });
    res.status(200).send(books);
  },
);

router.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().positive().required(),
    }),
  }),
  async (req: Request, res: Response) => {
    const book = await prisma.book.findOne({
      where: { id: +req.params.id },
      include: { author: true },
    });
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.status(200).send(book);
  },
);

export default router;
