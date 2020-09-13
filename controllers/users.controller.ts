import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import CreateUserDTO from '../dtos/CreateUserDTO';
import { plainToClass } from 'class-transformer';
import ResetPasswordDTO from 'dtos/ResetPasswordDTO';
import { FindDeleteUserDTO } from '../dtos';
import UserService from '../services/UserService';
import UpdateUserDTO from '../dtos/UpdateUserDTO';
import ListUsersDTO from '../dtos/ListUsersDTO';
import ForgotPasswordDTO from 'dtos/ForgotPasswordDTO';

@injectable()
class UserController {
  constructor(private readonly userService: UserService) {}

  public createUser = async (req: Request, res: Response) => {
    const userDto = plainToClass(CreateUserDTO, req.body);
    const user = await this.userService.createUser(userDto);
    res.status(201).send(user);
  };

  public deleteUser = async (req: Request, res: Response) => {
    const userDto = plainToClass(FindDeleteUserDTO, req.params);
    const user = await this.userService.deleteUser(userDto);
    res.status(200).send(user);
  };

  public updateUser = async (req: Request, res: Response) => {
    const userDto = plainToClass(UpdateUserDTO, { ...req.params, ...req.body });
    const user = await this.userService.updateUser(userDto);
    res.status(200).send(user);
  };

  public findUser = async (req: Request, res: Response) => {
    const userDto = plainToClass(FindDeleteUserDTO, req.params);
    const user = await this.userService.findUser(userDto);
    res.status(200).send(user);
  };

  public paginateUsers = async (req: Request, res: Response) => {
    const userDto = plainToClass(ListUsersDTO, req.query);
    const user = await this.userService.paginateUsers(userDto);
    res.status(200).send(user);
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userDto = plainToClass(ForgotPasswordDTO, req.body);
    try {
      await this.userService.forgotPassword(userDto);
      return res.status(201).json({
        success: true,
        message:
          'We have sent you an e-mail containing your password reset link.',
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const resetPasswordDTO = plainToClass(ResetPasswordDTO, {
      ...req.body,
      ...req.params,
    });
    try {
      await this.userService.resetPassword(resetPasswordDTO);
      return res.status(201).json({
        success: true,
        message: 'Password reseted.',
      });
    } catch (error) {
      next(error);
    }
  };
}
export default UserController;
