import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateBookDTO } from 'dtos/book';
import BookService from 'services/BookService';

@injectable()
class BookController {
  constructor(private readonly bookService: BookService) {}

  public createBook = async (req: Request, res: Response) => {
    const createBookDto = plainToClass(CreateBookDTO, {
      ...req.body,
      ...req.user,
    });
    const book = await this.bookService.createBook(createBookDto);
    res.status(201).send(book);
  };
}
export default BookController;
