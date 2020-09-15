import { User, Book } from '@prisma/client';
import { CreateUserDTO } from '../../dtos/auth';
import { ListUsersDTO, UpdateUserDTO } from '../../dtos/user';
import IUserRepository from '../../repository/user.irepository';
import { v4 } from 'uuid';

class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];
  getPaginatedUsers(
    userDto: ListUsersDTO,
  ): Promise<(User & { books: Book[] })[]> {
    throw new Error('Method not implemented.');
  }

  getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    if (user) {
      return Promise.resolve(user);
    } else {
      return Promise.resolve(null);
    }
  }

  findUserByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  findByResetPasswordToken(token: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  create({ email, password, username }: CreateUserDTO): Promise<User> {
    const user: User = {
      email,
      password,
      username,
      id: Number(v4()),
      married: true,
      role: 'ADMIN',
      createdAt: new Date(),
      resetPasswordExpire: null,
      resetPasswordToken: null,
    };
    this.users.push(user);
    return Promise.resolve({
      ...user,
      resetPasswordExpire: null,
      resetPasswordToken: null,
    });
  }

  delete(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }

  update(updateDto: UpdateUserDTO): Promise<User> {
    throw new Error('Method not implemented.');
  }

  findById(id: number): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
export default FakeUsersRepository;
