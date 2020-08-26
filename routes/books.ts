import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../index";
import isAuthenticated from "../utils/isAuthenticated";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user;
    const book = await prisma.book.create({
      data: {
        author: {
          connect: {
            id: +id,
          },
        },
        description: req.body.description,
        title: req.body.title,
      },
    });
    return res.status(200).send(book);
  }
);

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const book = await prisma.book.findOne({
    where: { id: +req.params.id },
    include: { author: true },
  });
  if (!book) return res.status(404).json({ error: "Not found" });
  if (book.authorId !== +req.user.id)
    return res.status(403).json({ error: "Not allowed" });

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

router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  const books = await prisma.book.findMany({
    include: {
      author: true,
    },
  });
  res.status(200).send(books);
});

router.get("/:id", async (req: Request, res: Response) => {
  const book = await prisma.book.findOne({
    where: { id: +req.params.id },
    include: { author: true },
  });
  if (!book) return res.status(404).json({ error: "Not found" });
  res.status(200).send(book);
});

export default router;
