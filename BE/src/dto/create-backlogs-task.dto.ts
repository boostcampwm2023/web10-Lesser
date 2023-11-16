import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

class taskDto {
  @IsNotEmpty()
  @IsInt()
  epicId: number;

  @IsNotEmpty()
  @IsInt()
  storyId: number;

  @IsOptional()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsInt()
  point: number;

  @IsNotEmpty()
  @IsString()
  condition: string;
}

export class createBacklogsTaskDto {
  @IsNotEmpty()
  @IsInt()
  projectId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => taskDto)
  task: taskDto;
}
