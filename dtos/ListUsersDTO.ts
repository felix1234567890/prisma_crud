import { IsInt, IsDefined, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export default class ListUsersDTO {
  @IsOptional()
  @IsInt()
  @Transform((value) => parseInt(value, 10), { toClassOnly: true })
  skip: number;

  @IsOptional()
  @IsInt()
  @Transform((value) => parseInt(value, 10), { toClassOnly: true })
  take: number;
}
