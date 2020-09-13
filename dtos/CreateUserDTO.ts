import {
  IsDefined,
  IsString,
  IsEmail,
  IsIn,
  IsOptional,
  MinLength,
} from 'class-validator';

export enum Role {
  // eslint-disable-next-line no-unused-vars
  USER,
  // eslint-disable-next-line no-unused-vars
  ADMIN,
}
export default class CreateUserDTO {
  @IsDefined()
  @IsString()
  public username: string;

  @IsDefined()
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  public role?: 'USER' | 'ADMIN';

  @IsDefined()
  @IsString()
  @MinLength(4)
  public password: string;
}
