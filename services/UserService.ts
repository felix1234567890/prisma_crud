import { inject, injectable } from 'tsyringe';
import validateClassParameters from '../utils/validateClassParameters';
import { plainToInstance } from 'class-transformer';
import { IBookRepository } from 'repository/book.repository';
import { IReviewRepository } from 'repository/review.repository';
import IUserRepository from 'repository/user.irepository';
import {
  UserResponseDTO,
  FindDeleteUserDTO,
  UpdateUserDTO,
  ListUsersDTO,
} from 'dtos/user';
import { redisClient } from '../utils/redis';

@injectable()
export default class UserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('BookRepository') private readonly bookRepository: IBookRepository,
    @inject('ReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  public async deleteUser(userDto: FindDeleteUserDTO) {
    await validateClassParameters(userDto);
    const user = await this.userRepository.delete(userDto.id);
    const res = plainToInstance(UserResponseDTO, user);
    return res;
  }

  public async updateUser(userDto: UpdateUserDTO) {
    await validateClassParameters(userDto);
    const user = await this.userRepository.update(userDto);
    const res = plainToInstance(UserResponseDTO, user);
    return res;
  }

  public async paginateUsers(userDto: ListUsersDTO) {
    await validateClassParameters(userDto);
    const users = await this.userRepository.getPaginatedUsers(userDto);
    const res = plainToInstance(UserResponseDTO, users);
    return res;
  }

  public async findUser({ id }: FindDeleteUserDTO) {
    const user = await this.userRepository.findById(id);
    const res = plainToInstance(UserResponseDTO, user);
    const books = JSON.stringify(await this.findUserBooks({ id }));
    redisClient.setEx(user?.username!, 3600, books);
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
