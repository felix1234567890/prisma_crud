import {
  IsDefined,
  IsString,
  IsEmail,
  IsIn,
  IsOptional,
  MinLength,
} from 'class-validator';
export default class CreateUserDTO {
  @IsDefined()
  @IsString()
  public username: string;

  @IsDefined()
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  public role?: Role;

  @IsDefined()
  @IsString()
  @MinLength(4)
  public password: string;
}
export enum Role {
  user = 'USER',
  admin = 'ADMIN',
}
