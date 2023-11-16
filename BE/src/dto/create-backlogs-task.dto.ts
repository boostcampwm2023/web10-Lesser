import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

class taskDto {
  @IsInt()
  @IsNotEmpty()
  epicId: number;

  @IsInt()
  @IsNotEmpty()
  storyId: number;

  @IsInt()
  @IsOptional()
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsInt()
  @IsNotEmpty()
  point: number;

  @IsString()
  @IsNotEmpty()
  condition: string;
}

export class createBacklogsTaskDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @Type(() => taskDto)
  @ValidateNested()
  @IsNotEmpty()
  task: taskDto;
}
