import {
  IsString,
  IsDefined,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export default class CreateBookDTO {
  @IsDefined()
  @IsInt()
  @Transform((value) => parseInt(value, 10), { toClassOnly: true })
  id: number;

  @IsDefined()
  @IsString()
  @MinLength(3, {
    message: 'Title is too short',
  })
  @MaxLength(50, {
    message: 'Title is too long',
  })
  public title: string;

  @IsDefined()
  @IsString()
  public description: string;

  @IsOptional()
  public yearPublished?: number;
}
