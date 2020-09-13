import { IsDefined, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export default class DeleteProfileDTO {
  @IsDefined()
  @IsInt()
  @Transform((value) => parseInt(value, 10), { toClassOnly: true })
  profileId: number;

  @IsDefined()
  @IsInt()
  @Transform((value) => parseInt(value, 10), { toClassOnly: true })
  id: number;
}
