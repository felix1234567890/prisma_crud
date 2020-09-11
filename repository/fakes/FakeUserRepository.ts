import { v4 } from 'uuid';
import IUserRepository from 'repository/user.irepository';
import ListUsersDTO from 'dtos/ListUsersDTO';
import CreateUserDTO from 'dtos/CreateUserDTO';
import UpdateUserDTO from 'dtos/UpdateUserDTO';
import UserReponse from 'dtos/UserResponse';
import { User } from '@prisma/client';

class FakeUserRepository implements IUserRepository {
  findUser(id: number): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  private users: User[] = [];
  getPaginatedUsers(
    userDto: ListUsersDTO,
  ): Promise<
    (import('.prisma/client').User & {
      books: import('.prisma/client').Book[];
    })[]
  > {
    throw new Error('Method not implemented.');
  }
  getUsers(): Promise<
    (import('.prisma/client').User & {
      books: import('.prisma/client').Book[];
    })[]
  > {
    throw new Error('Method not implemented.');
  }
  getUserByEmail(email: string): Promise<import('.prisma/client').User | null> {
    throw new Error('Method not implemented.');
  }
  createUser({ email, password, username }: CreateUserDTO): Promise<User> {
    const user = {
      id: 10,
      username,
      email,
      password,
      role: 'ADMIN',
    } as User;
    this.users.push(user);
    return new Promise((resolve) => resolve(user));
  }
  deleteUser(id: number): Promise<import('.prisma/client').User> {
    throw new Error('Method not implemented.');
  }
  updateUser(user: UpdateUserDTO): Promise<import('.prisma/client').User> {
    throw new Error('Method not implemented.');
  }
}
export default FakeUserRepository;
