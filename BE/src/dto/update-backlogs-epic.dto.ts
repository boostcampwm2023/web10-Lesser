import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsNotEmpty } from 'class-validator';

class EpicDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateBacklogsEpicDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @Type(() => EpicDto)
  @ValidateNested()
  @IsNotEmpty()
  epic: EpicDto;
}
