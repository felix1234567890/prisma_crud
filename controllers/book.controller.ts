import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateBookDTO, GetDeleteBookDTO } from 'dtos/book';
import BookService from 'services/BookService';
import UpdateBooDTO from 'dtos/book/UpdateBookDTO';

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

  public updateBook = async (req: Request, res: Response) => {
    const updateBookDto = plainToClass(UpdateBooDTO, {
      ...req.body,
      ...req.user,
      ...req.params,
    });
    const book = await this.bookService.updateBook(updateBookDto);
    res.status(200).send(book);
  };

  public getBooks = async (req: Request, res: Response) => {
    const books = await this.bookService.getBooks();
    res.status(200).send(books);
  };

  public deleteBook = async (req: Request, res: Response) => {
    const bookDto = plainToClass(GetDeleteBookDTO, {
      ...req.params,
      ...req.user,
    });
    const book = await this.bookService.deleteBook(bookDto);
    res.status(200).send(book);
  };

  public getBook = async (req: Request, res: Response) => {
    const bookDto = plainToClass(GetDeleteBookDTO, {
      ...req.params,
      ...req.user,
    });
    const book = await this.bookService.getBook(bookDto);
    res.status(200).send(book);
  };
}
export default BookController;
