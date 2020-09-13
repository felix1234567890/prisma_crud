import { injectable, inject } from 'tsyringe';
import IUserRepository from 'repository/user.irepository';
import CreateUserDTO from 'dtos/CreateUserDTO';
import UserResponseDTO from 'dtos/UserResponseDTO';
import validateClassParameters from 'utils/validateClassParameters';
import AppError from 'utils/AppError';
import { IHashService } from 'utils/BcryptService';
import { plainToClass } from 'class-transformer';
import { LoginUserDTO } from 'dtos';
import { IJWTService } from 'utils/JwtAuthService';

interface LoginResponse {
  token: string;
}

interface IAuthService {
  registerUser(userDto: CreateUserDTO): Promise<UserResponseDTO>;
  loginUser(userDto: LoginUserDTO): Promise<LoginResponse>;
}

@injectable()
class AuthService implements IAuthService {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('HashService') private readonly hashService: IHashService,
    @inject('JWTService') private readonly jwtService: IJWTService,
  ) {}

  public async registerUser(userDto: CreateUserDTO): Promise<UserResponseDTO> {
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

  public async loginUser(userDto: LoginUserDTO) {
    await validateClassParameters(userDto);
    const user = await this.userRepository.getUserByEmail(userDto.email);
    if (!user) {
      throw new AppError('User with this email doesn\t exist', false, 404);
    }
    if (!process.env.JWT_SECRET) throw new AppError('Env variable not loaded');
    const isMatch = this.hashService.compareHash(
      userDto.password,
      user.password,
    );

    if (isMatch) {
      const token = this.jwtService.authenticateUser(user);
      return { token };
    } else {
      const error = new AppError('Passwords dont match');
      throw error;
    }
  }
}
export default AuthService;
