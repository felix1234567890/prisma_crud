import { injectable, inject } from 'tsyringe';
import IUserRepository from 'repository/user.irepository';
import CreateUserDTO from '../dtos/CreateUserDTO';
import UserResponseDTO from '../dtos/UserResponseDTO';
import validateClassParameters from '../utils/validateClassParameters';
import AppError from '../utils/AppError';
import { plainToClass } from 'class-transformer';
import { IHashService } from 'utils/BcryptService';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('HashService') private readonly hashService: IHashService,
  ) {}

  public async execute(userDto: CreateUserDTO): Promise<UserResponseDTO> {
    await validateClassParameters(userDto);
    const user = await this.userRepository.getUserByEmail(userDto.email);
    if (user) {
      throw new AppError('User exists with this same e-mail', false, 400);
    }
    const password = this.hashService.generateHash(userDto.password);
    const createdUser = await this.userRepository.createUser({
      ...userDto,
      password,
    });
    const res = plainToClass(UserResponseDTO, createdUser);
    return res;
  }
}
