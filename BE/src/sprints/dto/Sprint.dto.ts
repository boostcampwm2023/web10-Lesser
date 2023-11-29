import { PickType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

class BaseSprintDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsDateString()
  closedDate: Date;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsArray()
  taskList: number[];
}

export class CreateSprintRequestDto extends PickType(BaseSprintDto, [
  'title',
  'goal',
  'startDate',
  'endDate',
  'projectId',
  'taskList',
]) {}
export class CreateSprintResponseDto extends PickType(BaseSprintDto, ['id']) {}
