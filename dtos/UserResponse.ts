import { Book } from '@prisma/client';

export default class UserReponse {
  id: number;
  username: string;
  email: string;
  married: boolean | null;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  books: Array<Book>;
  // constructor(
  //   username: string,
  //   email: string,
  //   married: string | null,
  //   role: "USER" | "ADMIN",
  //   createdAt: Date,
  //   books: Array<Book>
  // ) {
  //   this.username = username;
  //   this.email = email;
  //   this.married = married;
  //   this.role = role;
  //   this.createdAt = createdAt;
  //   this.books = books;
  // }
}
