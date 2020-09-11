import { Book } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class UserResponseDTO {
  id: number;
  username: string;
  email: string;
  married: string | null;
  @Exclude()
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  books: Array<Book>;
}
