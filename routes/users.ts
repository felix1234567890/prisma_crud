import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcrypt';
import asyncHandler from '../utils/asyncHandler';
import UserController from '../controllers/users.controller';
import { container } from 'tsyringe';
import UserRepository from '../repository/user.repository';
import IUserRepository from '../repository/user.irepository';
import { IJWTService } from 'utils/JwtAuthService';
import AppError from 'utils/AppError';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - username
 *          - email
 *          - password
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id of the book.
 *          username:
 *            type: string
 *            description: User's username
 *        example:
 *          id: 1
 *          username: frane
 *          email: frane@gmail.com
 *          password: teskalozinka12345
 */

const userController = container.resolve(UserController);
const jwtService = container.resolve<IJWTService>('JWTService');
const router = Router();

// router.get(
//   "/",
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { skip, take, sortBy } = req.query;
//     if (skip && take) {
//       const users = await prisma.user.findMany({
//         include: {
//           books: true,
//         },
//         skip: +skip,
//         take: +take,
//       });
//       res.status(200).send(users);
//     } else if (sortBy) {
//       if (sortBy === "desc") {
//         const users = await prisma.user.findMany({
//           include: {
//             books: true,
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//         });
//         res.status(200).send(users);
//       }
//     } else {
//       const users = await prisma.user.findMany({
//         include: {
//           books: true,
//           reviews: true,
//         },
//       });
//       res.status(200).send(users);
//     }
//   })
// );
/**
 * @swagger
 * tags:
 *  name: Users
 *  descriptions: API to manage users
 * */
/**
 * @swagger
 * path:
 *  /users/:
 *    get:
 *      summary: Get list of all users
 *      tags: [Users]
 *      responses:
 *       "200":
 *         description: Obtainer users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *    post:
 *        summary: Create new user
 *        tags: [Users]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        responses:
 *           "200":
 *              description: Created user
 *              content:
 *                application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/User'
 * */
router
  .route('/')
  .get(asyncHandler(userController.paginateUsers))
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.findUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);
// router.get('/', asyncHandler(userController.paginateUsers));
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword/:token', userController.resetPassword);
// router.get('/:id', userController.findUser);
// // router.post('/', userController.createUser);
// //router.post("/password/forgot", userController.resetPassword);
// router.delete('/:id', userController.deleteUser);
// router.put('/:id', userController.updateUser);
// router.post(
//   '/',
//   validationRules(),
//   validate,
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { username, email, married } = req.body;
//     let password = req.body;
//     try {
//       const salt = await bcrypt.genSalt(12);
//       password = await bcrypt.hash(password, salt);
//       const user = await prisma.user.create({
//         data: {
//           email,
//           username,
//           password,
//           married,
//         },
//       });
//       res.status(201).send(user);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },
// );

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

router.get(
  '/:id/books',
  async (req: Request, res: Response, next: NextFunction) => {
    const books = await prisma.book.findMany({
      where: {
        authorId: +req.params.id,
      },
    });
    res.status(200).send(books);
  },
);

router.get(
  '/:id/reviews',
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await prisma.review.findMany({
      where: {
        userId: +req.params.id,
      },
      select: {
        text: true,
        book: true,
      },
    });
    res.status(200).send(reviews);
  },
);
export default router;
