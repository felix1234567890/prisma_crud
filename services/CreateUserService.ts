import { injectable, inject, container } from 'tsyringe';
import IUserRepository from 'repository/user.irepository';
import CreateUserDTO from '../dtos/CreateUserDTO';
import UserResponseDTO from '../dtos/UserResponseDTO';
import validateClassParameters from '../utils/validateClassParameters';
import AppError from '../utils/AppError';
import bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import UserRepository from '../repository/user.repository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}
  public async execute(userDto: CreateUserDTO): Promise<UserResponseDTO> {
    await validateClassParameters(userDto);
    const user = await this.userRepository.getUserByEmail(userDto.email);
    if (user) {
      throw new AppError('User exists with this same e-mail', false, 400);
    }
    const password = bcrypt.hashSync(userDto.password, 10);
    const createdUser = await this.userRepository.createUser({
      ...userDto,
      password,
    });
    const res = plainToClass(UserResponseDTO, createdUser);
    return res;
  }
}
