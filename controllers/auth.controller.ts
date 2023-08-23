import { injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import AuthService from 'services/AuthService';
import {
  CreateUserDTO,
  LoginUserDTO,
  ResetPasswordDTO,
  ForgotPasswordDTO,
} from 'dtos/auth';

@injectable()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  public registerUser = async (req: Request, res: Response) => {
    const userDto = plainToInstance(CreateUserDTO, req.body);
    const user = await this.authService.registerUser(userDto);
    res.status(201).send(user);
  };

  public loginUser = async (req: Request, res: Response) => {
    const userDto = plainToInstance(LoginUserDTO, req.body);
    const token = await this.authService.loginUser(userDto);
    res.status(200).send(token);
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userDto = plainToInstance(ForgotPasswordDTO, req.body);
    try {
      await this.authService.forgotPassword(userDto);
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
    const resetPasswordDTO = plainToInstance(ResetPasswordDTO, {
      ...req.body,
      ...req.params,
    });
    try {
      await this.authService.resetPassword(resetPasswordDTO);
      return res.status(201).json({
        success: true,
        message: 'Password reseted.',
      });
    } catch (error) {
      next(error);
    }
  };
}
export default AuthController;
