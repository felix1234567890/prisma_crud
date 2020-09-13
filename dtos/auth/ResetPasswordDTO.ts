import { IsDefined, IsString, MinLength } from 'class-validator';
import { Match } from 'utils/match.decorator';

export default class ResetPasswordDTO {
  @IsDefined()
  @IsString()
  @MinLength(4)
  password: string;

  @IsDefined()
  @IsString()
  @MinLength(4)
  @Match('password')
  confirmPassword: string;

  @IsDefined()
  @IsString()
  token: string;
}
