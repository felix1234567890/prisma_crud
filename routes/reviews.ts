import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../index";
import isAuthenticated from "../utils/isAuthenticated";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId, text } = req.body;
    const { id } = req.user;
    const book = await prisma.book.findOne({
      where: { id: +bookId },
    });
    if (!book) return res.status(404).json({ error: "Not found" });
    if (book.authorId === +id) {
      return res.status(403).json({ error: "Not allowed to review own book" });
    }
    const review = await prisma.review.create({
      data: {
        user: {
          connect: {
            id: +id,
          },
        },
        book: {
          connect: {
            id: bookId,
          },
        },
        text: text,
      },
    });
    return res.status(200).send(review);
  }
);

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  const book = await prisma.book.findOne({
    where: { id: +req.params.id },
    include: { author: true },
  });
  if (!book) return res.status(404).json({ error: "Not found" });
  if (book.authorId !== +req.user.id) {
    return res.status(403).json({ error: "Not allowed" });
  }

  await prisma.book.update({
    where: {
      id: +req.params.id,
    },
    data: {
      description: req.body.description,
      title: req.body.title,
    },
  });
});

router.get("/", async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      book: true,
    },
  });
  res.status(200).send(reviews);
});

router.get("/:id", isAuthenticated, async (req: Request, res: Response) => {
  const review = await prisma.review.findOne({
    where: {
      userId_bookId: {
        bookId: +req.params.id,
        userId: +req.user.id,
      },
    },
    select: { user: true, book: true, text: true },
  });
  if (!review) return res.status(404).json({ error: "Not found" });
  res.status(200).send(review);
});

export default router;
