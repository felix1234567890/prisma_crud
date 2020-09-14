import { prisma } from '../index';
import IUserRepository from './user.irepository';
import { User } from '@prisma/client';
import { injectable } from 'tsyringe';
import { ListUsersDTO, UpdateUserDTO } from 'dtos/user';
import { CreateUserDTO } from 'dtos/auth';

@injectable()
class UserRepository implements IUserRepository {
  async findByResetPasswordToken(token: string): Promise<User | null> {
    const user = await prisma.user.findOne({
      where: { resetPasswordToken: token },
    });
    return user;
  }

  async findById(id: number): Promise<User | null> {
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

  async getAll() {
    const users = await prisma.user.findMany({});
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

  async create(createDto: CreateUserDTO) {
    const user = await prisma.user.create({
      data: {
        ...createDto,
      },
    });
    return user;
  }

  async delete(id: number) {
    const user = await prisma.user.delete({ where: { id } });
    return user;
  }

  async update({ id, ...rest }: UpdateUserDTO) {
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
