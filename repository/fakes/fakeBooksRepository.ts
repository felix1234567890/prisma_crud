import { Book } from '@prisma/client';
import { CreateBookDTO, UpdateBookDTO } from 'dtos/book';
import { IBookRepository } from 'repository/book.repository';

class FakeBooksRepository implements IBookRepository {
  findUserBooks(id: number): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }

  create(createDTO: CreateBookDTO): Promise<Book> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<Book> {
    throw new Error('Method not implemented.');
  }

  update(updateDto: UpdateBookDTO): Promise<Book> {
    throw new Error('Method not implemented.');
  }

  findById(id: number): Promise<Book | null> {
    throw new Error('Method not implemented.');
  }

  getAll(): Promise<Book[]> {
    throw new Error('Method not implemented.');
  }
}
export default FakeBooksRepository;
