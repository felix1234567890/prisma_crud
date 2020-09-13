import { inject, injectable } from 'tsyringe';
import CreateUserDTO from '../dtos/CreateUserDTO';
import validateClassParameters from '../utils/validateClassParameters';
import AppError from '../utils/AppError';
import bcrypt from 'bcrypt';
import { plainToClass, classToClass } from 'class-transformer';
import UserResponseDTO from '../dtos/UserResponseDTO';
import { FindDeleteUserDTO } from '../dtos';
import IUserRepository from '../repository/user.irepository';
import UpdateUserDTO from '../dtos/UpdateUserDTO';
import ListUsersDTO from '../dtos/ListUsersDTO';
import ForgotPasswordDTO from 'dtos/ForgotPasswordDTO';
import crypto from 'crypto';
import { IMailService } from 'utils/MailService';
import ResetPasswordDTO from 'dtos/ResetPasswordDTO';

@injectable()
export default class UserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    @inject('MailService') private readonly mailService: IMailService,
  ) {}

  public async createUser(userDto: CreateUserDTO): Promise<UserResponseDTO> {
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

  public async deleteUser(userDto: FindDeleteUserDTO) {
    await validateClassParameters(userDto);
    const user = await this.userRepository.deleteUser(userDto.id);
    const res = plainToClass(UserResponseDTO, user);
    return res;
  }

  public async updateUser(userDto: UpdateUserDTO) {
    await validateClassParameters(userDto);
    const user = await this.userRepository.updateUser(userDto);
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
    const user = await this.userRepository.findUserById(id);
    const res = plainToClass(UserResponseDTO, user);
    return res;
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
      // const res = plainToClass(UserResponseDTO, userData);
      // return res;
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

      user.password = bcrypt.hashSync(resetPasswordDTO.password, 10);
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
