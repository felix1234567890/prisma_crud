import { IsDefined, IsEmail } from 'class-validator';

export default class ForgotPasswordDTO {
  @IsDefined()
  @IsEmail()
  email: string;
}
