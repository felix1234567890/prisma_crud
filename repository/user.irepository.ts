import { User, Book } from '@prisma/client';
import CreateUserDTO from 'dtos/auth/CreateUserDTO';
import UpdateUserDTO from 'dtos/user/UpdateUserDTO';
import ListUsersDTO from 'dtos/user/ListUsersDTO';
import { IBaseRepository } from './base.repository';

export default interface IUserRepository
  extends IBaseRepository<CreateUserDTO, UpdateUserDTO, User> {
  getPaginatedUsers(
    userDto: ListUsersDTO,
  ): Promise<(User & { books: Book[] })[]>;
  getUserByEmail(email: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findByResetPasswordToken(token: string): Promise<User | null>;
}
