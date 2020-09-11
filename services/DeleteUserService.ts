import { injectable, inject } from "tsyringe";
import IUserRepository from "repository/user.irepository";
import { DeleteUserDTO } from "../dtos";
import validateClassParameters from "utils/validateClassParameters";
import { plainToClass } from "class-transformer";
import UserResponseDTO from "dtos/UserResponseDTO";

@injectable()
export default class DeleteUserService {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository
  ) {}
  public async execute(userDto: DeleteUserDTO) {
    await validateClassParameters(userDto);
    const user = await this.userRepository.deleteUser(userDto.id);
    const res = plainToClass(UserResponseDTO, user);
    return res;
  }
}
