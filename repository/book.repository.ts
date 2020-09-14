import { injectable } from 'tsyringe';
import { prisma } from 'index';
import { Book } from '@prisma/client';
import AppError from 'utils/AppError';
import { IBaseRepository } from './base.repository';
import CreateBookDTO from 'dtos/book/CreateBookDTO';

export interface IBookRepository extends IBaseRepository<CreateBookDTO, Book> {
  findUserBooks(id: number): Promise<Book[]>;
}

@injectable()
class BookRepository implements IBookRepository {
  public async create({
    id,
    description,
    title,
    yearPublished,
  }: CreateBookDTO): Promise<Book> {
    const book = await prisma.book.create({
      data: {
        author: {
          connect: {
            id,
          },
        },
        description,
        title,
        yearPublished,
      },
    });
    return book;
  }

  delete(id: number): Promise<Book> {
    throw new Error('Method not implemented.');
  }

  update(updateDto: null): Promise<Book> {
    throw new Error('Method not implemented.');
  }

  findById(id: number): Promise<Book | null> {
    throw new Error('Method not implemented.');
  }

  getAll(): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }

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
