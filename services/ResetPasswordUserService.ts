import { injectable, inject } from 'tsyringe';
import IUserRepository from 'repository/user.irepository';
import ResetPasswordDTO from 'dtos/ResetPasswordDTO';
import validateClassParameters from 'utils/validateClassParameters';

@injectable()
export default class ResetPasswordUserService {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}

  public async execute(resetPasswordDto: ResetPasswordDTO) {
    return await validateClassParameters(resetPasswordDto);
  }
}
