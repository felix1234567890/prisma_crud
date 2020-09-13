import { inject, injectable } from 'tsyringe';
import CreateUserDTO from '../dtos/auth/CreateUserDTO';
import validateClassParameters from '../utils/validateClassParameters';
import AppError from '../utils/AppError';
import bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { IBookRepository } from 'repository/book.repository';
import { IReviewRepository } from 'repository/review.repository';
import IUserRepository from 'repository/user.irepository';
import {
  UserResponseDTO,
  FindDeleteUserDTO,
  UpdateUserDTO,
  ListUsersDTO,
} from 'dtos/user';

@injectable()
export default class UserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('BookRepository') private readonly bookRepository: IBookRepository,
    @inject('ReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  public async createUser(userDto: CreateUserDTO): Promise<UserResponseDTO> {
    await validateClassParameters(userDto);
    const user = await this.userRepository.getUserByEmail(userDto.email);
    if (user) {
      throw new AppError('User exists with this same e-mail', false, 400);
    }
    const password = bcrypt.hashSync(userDto.password, 10);
    const createdUser = await this.userRepository.create({
      ...userDto,
      password,
    });
    const res = plainToClass(UserResponseDTO, createdUser);
    return res;
  }

  public async deleteUser(userDto: FindDeleteUserDTO) {
    await validateClassParameters(userDto);
    const user = await this.userRepository.delete(userDto.id);
    const res = plainToClass(UserResponseDTO, user);
    return res;
  }

  public async updateUser(userDto: UpdateUserDTO) {
    await validateClassParameters(userDto);
    const user = await this.userRepository.update(userDto);
    const res = plainToClass(UserResponseDTO, user);
    return res;
  }

  public async paginateUsers(userDto: ListUsersDTO) {
    await validateClassParameters(userDto);
    const users = await this.userRepository.getPaginatedUsers(userDto);
    const res = plainToClass(UserResponseDTO, users);
    return res;
  }

  public async findUser({ id }: FindDeleteUserDTO) {
    const user = await this.userRepository.findById(id);
    const res = plainToClass(UserResponseDTO, user);
    return res;
  }

  public async findUserBooks({ id }: FindDeleteUserDTO) {
    const books = await this.bookRepository.findUserBooks(id);
    return books;
  }

  public async findUserReviews({ id }: FindDeleteUserDTO) {
    const reviews = await this.reviewRepository.findUserReviews(id);
    return reviews;
  }
}
