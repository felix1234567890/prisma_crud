import { IsDefined, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export default class FindDeleteUserDTO {
  @IsDefined()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
