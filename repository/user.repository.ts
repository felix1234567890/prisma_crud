import { prisma } from '../index';
import IUserRepository from './user.irepository';
import CreateUserDTO from 'dtos/CreateUserDTO';
import { User } from '@prisma/client';
import { injectable } from 'tsyringe';
import UpdateUserDTO from 'dtos/UpdateUserDTO';
import ListUsersDTO from 'dtos/ListUsersDTO';

@injectable()
class UserRepository implements IUserRepository {
  async findByResetPasswordToken(token: string): Promise<User | null> {
    const user = await prisma.user.findOne({
      where: { resetPasswordToken: token },
    });
    return user;
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await prisma.user.findOne({
      where: { id },
    });
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findOne({
      where: { email },
    });
    return user;
  }

  async getPaginatedUsers({ skip, take }: ListUsersDTO) {
    const users = await prisma.user.findMany({
      include: {
        books: true,
      },
      skip,
      take,
    });

    return users;
  }

  async getUsers() {
    const users = await prisma.user.findMany({
      include: {
        books: true,
      },
    });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await prisma.user.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async createUser(userDto: CreateUserDTO) {
    const user = await prisma.user.create({
      data: {
        ...userDto,
      },
    });
    return user;
  }

  async deleteUser(id: number) {
    const user = await prisma.user.delete({ where: { id } });
    return user;
  }

  async updateUser({ id, ...rest }: UpdateUserDTO) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
      },
    });
    return user;
  }
}
export default UserRepository;
