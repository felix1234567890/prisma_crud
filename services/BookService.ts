import { injectable, inject } from 'tsyringe';
import { IBookRepository } from 'repository/book.repository';
import { CreateBookDTO } from 'dtos/book';
import validateClassParameters from 'utils/validateClassParameters';

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
}
export default BookService;
