import { injectable } from 'tsyringe';
import { prisma } from 'index';
import { Book } from '@prisma/client';
import AppError from 'utils/AppError';

export interface IBookRepository {
  findUserBooks(id: number): Promise<Book[]>;
  // createBook(): Promise<Book>;
  // updateBook(): Promise<Book>;
  // getAllBooks(): Promise<(Book & { author: User })[]>;
}

@injectable()
class BookRepository {
  public async findUserBooks(id: number) {
    const author = await prisma.user.findOne({
      where: { id },
    });
    if (!author)
      throw new AppError('User with provided id not found', false, 404);
    const books = await prisma.book.findMany({
      where: {
        author,
      },
    });
    return books;
  }

  //   public async createBook() {
  //     const book = await prisma.book.create({
  //       data: {
  //         author: {
  //           connect: {
  //             id: +id,
  //           },
  //         },
  //         description: req.body.description,
  //         title: req.body.title,
  //       },
  //     });
  //     return book;
  //   }

  //   public async updateBook() {
  //     const book = prisma.book.update({
  //       where: {
  //         id: +req.params.id,
  //       },
  //       data: {
  //         description: req.body.description,
  //         title: req.body.title,
  //         yearPublished: req.body.yearPublished,
  //       },
  //       include: {
  //         author: true,
  //       },
  //     });
  //     return book;
  //   }

  //   public async getAllBooks() {
  //     const books = await prisma.book.findMany({
  //       include: {
  //         author: true,
  //       },
  //     });
  //     return books;
  //   }

  //   public async findBookById() {
  //     const book = await prisma.book.findOne({
  //       where: { id: +req.params.id },
  //       include: { author: true },
  //     });
  //     return book;
  //   }
  // }
}
export default BookRepository;
