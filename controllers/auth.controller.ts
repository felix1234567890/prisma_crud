import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import AuthService from 'services/AuthService';
import { CreateUserDTO, LoginUserDTO } from 'dtos';

@injectable()
class AuthController {
  constructor(private readonly authService: AuthService) {}
  public registerUser = async (req: Request, res: Response) => {
    const userDto = plainToClass(CreateUserDTO, req.body);
    const user = await this.authService.registerUser(userDto);
    res.status(201).send(user);
  };

  public loginUser = async (req: Request, res: Response) => {
    const userDto = plainToClass(LoginUserDTO, req.body);
    const token = await this.authService.loginUser(userDto);
    res.status(200).send(token);
  };
}
export default AuthController;
