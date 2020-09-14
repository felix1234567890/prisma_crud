import { injectable, inject } from 'tsyringe';
import { IBookRepository } from 'repository/book.repository';
import { CreateBookDTO, GetDeleteBookDTO, UpdateBookDTO } from 'dtos/book';
import validateClassParameters from 'utils/validateClassParameters';
import AppError from 'utils/AppError';

@injectable()
class BookService {
  constructor(
    @inject('BookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  public async createBook(bookDto: CreateBookDTO) {
    await validateClassParameters(bookDto);
    const book = await this.bookRepository.create(bookDto);
    return book;
  }

  public async updateBook(bookDto: UpdateBookDTO) {
    await validateClassParameters(bookDto);
    const book = await this.bookRepository.findById(bookDto.bookId);
    if (!book) throw new AppError('Not found', false, 404);
    if (book.authorId !== bookDto.id) {
      throw new AppError('Not allowed', false, 403);
    }
    const res = await this.bookRepository.update(bookDto);
    return res;
  }

  public async getBooks() {
    const books = await this.bookRepository.getAll();
    return books;
  }

  public async deleteBook({ bookId, id }: GetDeleteBookDTO) {
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new AppError('Book not found', false, 404);
    if (book.authorId !== id)
      throw new AppError('You cannot delete book that you don\t own');
    await this.bookRepository.delete(bookId);
    return book;
  }

  public async getBook({ bookId }: Pick<GetDeleteBookDTO, 'bookId'>) {
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new AppError('Book not found', false, 404);
    return book;
  }
}
export default BookService;
