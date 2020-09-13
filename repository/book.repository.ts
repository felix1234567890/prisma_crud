import { injectable } from 'tsyringe';
import { prisma } from 'index';
import { Book } from '@prisma/client';
import AppError from 'utils/AppError';

export interface IBookRepository {
  findUserBooks(id: number): Promise<Book[]>;
}
@injectable()
class BookRepository implements IBookRepository {
  async findUserBooks(id: number) {
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
}
export default BookRepository;
