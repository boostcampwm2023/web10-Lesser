import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class baseEpicDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class baseStoryDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  epicId: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class baseTaskDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  storyId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsOptional()
  userId?: number;

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
