import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

class TaskDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsInt()
  @IsOptional()
  point: number;

  @IsString()
  @IsOptional()
  condition: string;
}

export class UpdateBacklogsTaskDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @Type(() => TaskDto)
  @ValidateNested()
  @IsNotEmpty()
  task: TaskDto;
}
