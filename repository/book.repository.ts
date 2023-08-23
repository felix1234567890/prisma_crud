import { injectable } from 'tsyringe';
import { prisma } from 'index';
import { Book } from '@prisma/client';
import AppError from 'utils/AppError';
import { IBaseRepository } from './base.repository';
import { UpdateBookDTO, CreateBookDTO } from 'dtos/book';

export interface IBookRepository
  extends IBaseRepository<CreateBookDTO, Book, UpdateBookDTO> {
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

  public async update({
    bookId,
    description,
    title,
    yearPublished,
  }: UpdateBookDTO): Promise<Book> {
    const book = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        description,
        title,
        yearPublished,
      },
      include: {
        author: true,
      },
    });
    return book;
  }

  public async findById(id: number): Promise<Book | null> {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });
    return book;
  }

  public async getAll(): Promise<Book[]> {
    const books = await prisma.book.findMany({
      include: {
        author: true,
      },
    });
    return books;
  }

  public async findUserBooks(id: number) {
    const author = await prisma.user.findUnique({
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

  public async delete(id: number): Promise<Book> {
    const book = await prisma.book.delete({
      where: { id },
    });
    return book;
  }
}
export default BookRepository;
