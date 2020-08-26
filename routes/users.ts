import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../index";
import { validationRules, validate } from "../validators/createUserValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotnev from "dotenv";

dotnev.config();

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { skip, take, sortBy } = req.query;
  if (skip && take) {
    const users = await prisma.user.findMany({
      include: {
        books: true,
      },
      skip: +skip,
      take: +take,
    });
    res.status(200).send(users);
  } else if (sortBy) {
    if (sortBy === "desc") {
      const users = await prisma.user.findMany({
        include: {
          books: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).send(users);
    }
  } else {
    const users = await prisma.user.findMany({
      include: {
        books: true,
        reviews: true,
      },
    });
    res.status(200).send(users);
  }
});

router.post(
  "/",
  validationRules(),
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, married } = req.body;
    let password = req.body;
    try {
      const salt = await bcrypt.genSalt(12);
      password = await bcrypt.hash(password, salt);
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password,
          married,
        },
      });
      res.status(201).send(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await prisma.user.findOne({
      where: {
        email,
      },
    });
    if (!user) return res.status(404).send({ message: "Not found" });
    if (!process.env.JWT_SECRET) throw new Error("Env variable not loaded");
    const isMatch = bcrypt.compare(password, user?.password);
    if (isMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.status(200).json(token);
    }
  }
);

router.get(
  "/:id/books",
  async (req: Request, res: Response, next: NextFunction) => {
    const books = await prisma.book.findMany({
      where: {
        authorId: +req.params.id,
      },
    });
    res.status(200).send(books);
  }
);

router.get(
  "/:id/reviews",
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
  }
);
export default router;
