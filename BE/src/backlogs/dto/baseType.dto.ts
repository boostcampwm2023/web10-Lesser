import { IsInt, IsNotEmpty, IsOptional, IsString, Validate, ValidateIf } from 'class-validator';
import { IsNullOrIntAndNotEmpty } from 'src/common/decorators/IsNullOrIntDecorator';

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

  sequence: number;
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

  sequence: number;
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

  @Validate(IsNullOrIntAndNotEmpty)
  userId: number | null;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsInt()
  @IsNotEmpty()
  point: number;

  @IsString()
  @IsNotEmpty()
  condition: string;

  sequence: number;
}
