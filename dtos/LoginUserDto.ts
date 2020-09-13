import { IsDefined, IsString, IsEmail, MinLength } from 'class-validator';

export default class CreateUserDTO {
  @IsDefined()
  @IsEmail()
  public email: string;

  @IsDefined()
  @IsString()
  @MinLength(4)
  public password: string;
}
