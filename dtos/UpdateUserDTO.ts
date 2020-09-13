import {
  IsDefined,
  IsString,
  IsEmail,
  IsIn,
  IsOptional,
  MinLength,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
export default class UpdateUserDTO {
  @IsDefined()
  @IsInt()
  @Transform((value) => parseInt(value, 10), { toClassOnly: true })
  id: number;

  @IsOptional()
  @IsString()
  public username?: string;

  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  public role: Role;

  @IsOptional()
  @IsString()
  @MinLength(4)
  public password?: string;
}
enum Role {
  user = 'USER',
  admin = 'ADMIN',
}
