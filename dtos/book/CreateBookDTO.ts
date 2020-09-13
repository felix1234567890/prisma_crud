import { IsString, IsDefined } from 'class-validator';

export default class CreateBookDTO {
  @IsDefined()
  @IsString()
  public username: string;
}
