import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsNotEmpty } from 'class-validator';

class epicDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class updateBacklogsEpicDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @Type(() => epicDto)
  @ValidateNested()
  @IsNotEmpty()
  epic: epicDto;
}
