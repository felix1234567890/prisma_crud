import { Transform } from 'class-transformer';
import { IsDefined, IsInt } from 'class-validator';

export default class GetDeleteBookDTO {
  @IsDefined()
  @IsInt()
  @Transform((value) => parseInt(value, 10))
  bookId: number;

  @IsDefined()
  @IsInt()
  @Transform((value) => parseInt(value, 10))
  id: number;
}
