import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { plainToInstance } from 'class-transformer';
import {
  FindDeleteUserDTO,
  UpdateUserDTO,
  ListUsersDTO,
  UserResponseDTO,
} from '../dtos/user';
import UserService from '../services/UserService';

@injectable()
class UserController {
  constructor(private readonly userService: UserService) {}

  public deleteUser = async (
    req: Request,
    res: Response,
  ): Promise<Response<UserResponseDTO[]>> => {
    const userDto = plainToInstance(FindDeleteUserDTO, req.params);
    const user = await this.userService.deleteUser(userDto);
    return res.status(200).send(user);
  };

  public updateUser = async (
    req: Request,
    res: Response,
  ): Promise<Response<UserResponseDTO>> => {
    const userDto = plainToInstance(UpdateUserDTO, { ...req.params, ...req.body });
    const user = await this.userService.updateUser(userDto);
    return res.status(200).send(user);
  };

  public findUser = async (req: Request, res: Response) => {
    const userDto = plainToInstance(FindDeleteUserDTO, req.params);
    const user = await this.userService.findUser(userDto);
    res.status(200).send(user);
  };

  public paginateUsers = async (req: Request, res: Response) => {
    const userDto = plainToInstance(ListUsersDTO, req.query);
    const user = await this.userService.paginateUsers(userDto);
    res.status(200).send(user);
  };

  public getUserBooks = async (req: Request, res: Response) => {
    const userDto = plainToInstance(FindDeleteUserDTO, req.params);
    const books = await this.userService.findUserBooks(userDto);
    res.status(200).send(books);
  };

  public getUserReviews = async (req: Request, res: Response) => {
    const userDto = plainToInstance(FindDeleteUserDTO, req.params);
    const reviews = await this.userService.findUserReviews(userDto);
    res.status(200).send(reviews);
  };
}
export default UserController;
