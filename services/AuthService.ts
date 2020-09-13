import { injectable, inject } from 'tsyringe';
import IUserRepository from 'repository/user.irepository';
import CreateUserDTO from 'dtos/auth/CreateUserDTO';
import UserResponseDTO from 'dtos/user/UserResponseDTO';
import validateClassParameters from 'utils/validateClassParameters';
import AppError from 'utils/AppError';
import { IHashService } from 'utils/BcryptService';
import { plainToClass } from 'class-transformer';
import { LoginUserDTO, ForgotPasswordDTO, ResetPasswordDTO } from 'dtos/auth';
import { IJWTService } from 'utils/JwtAuthService';
import UpdateUserDTO from 'dtos/user/UpdateUserDTO';
import crypto from 'crypto';
import { IMailService } from 'utils/MailService';

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
    @inject('MailService') private readonly mailService: IMailService,
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

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDTO) {
    await validateClassParameters(forgotPasswordDto);
    const user = await this.userRepository.findUserByEmail(
      forgotPasswordDto.email,
    );
    const [resetToken, hashToken] = this.generateResetPasswordToken();
    const expirationTime = new Date(Date.now() + 30 * 60 * 1000);
    if (user) {
      user.resetPasswordToken = hashToken;
      user.resetPasswordExpire = expirationTime;
      const userDto = plainToClass(UpdateUserDTO, user);
      const userData = await this.userRepository.updateUser(userDto);
      const host = process.env.HOST || `http://localhost:3000`;
      await this.mailService.sendMail({
        to: userData.email,
        from: process.env.USERNAME as string,
        subject: 'Password Recovery',
        text: `Hello ${userData.username}, here is the link to reset your account password: ${host}/users/resetPassword/${resetToken}`,
      });
    }
  }

  public async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    await validateClassParameters(resetPasswordDTO);
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetPasswordDTO.token)
      .digest('hex');
    const user = await this.userRepository.findByResetPasswordToken(
      resetPasswordToken,
    );
    if (user) {
      if (user.resetPasswordExpire && user.resetPasswordExpire < new Date()) {
        throw new AppError('Password reset token is invalid.', false, 400);
      }

      user.password = this.hashService.generateHash(resetPasswordDTO.password);
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      const userDto = plainToClass(UpdateUserDTO, user);
      await this.userRepository.updateUser(userDto);
    } else {
      throw new AppError('No user found');
    }
  }

  private generateResetPasswordToken(): Array<string> {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    return [resetToken, hashToken];
  }
}
export default AuthService;
