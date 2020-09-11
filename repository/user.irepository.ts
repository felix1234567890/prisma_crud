import { User, Book } from '@prisma/client';
import CreateUserDTO from 'dtos/CreateUserDTO';
import UserReponse from 'dtos/UserResponse';
import UserResponseDTO from 'dtos/UserResponseDTO';
import UpdateUserDTO from 'dtos/UpdateUserDTO';
import ListUsersDTO from 'dtos/ListUsersDTO';
import AppError from 'utils/AppError';

export default interface IUserRepository {
  getPaginatedUsers(
    userDto: ListUsersDTO,
  ): Promise<(User & { books: Book[] })[]>;
  getUsers(): Promise<(User & { books: Book[] })[]>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: CreateUserDTO): Promise<User>;
  deleteUser(id: number): Promise<User>;
  updateUser(user: UpdateUserDTO): Promise<User>;
  findUserById(id: number): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findByResetPasswordToken(token: string): Promise<User | null>;
}
