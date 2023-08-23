import { IsDefined, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export default class DeleteProfileDTO {
  @IsDefined()
  @IsInt()
  @Transform(({value}) => parseInt(value, 10))
  profileId: number;

  @IsDefined()
  @IsInt()
  @Transform(({value}) => parseInt(value, 10))
  id: number;
}
