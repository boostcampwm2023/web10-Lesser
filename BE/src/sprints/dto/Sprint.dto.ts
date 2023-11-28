import { PickType } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

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
  actualEndDate: Date;

  @IsInt()
  @IsNotEmpty()
  projectId: number;
}

export class CreateSprintRequestDto extends PickType(BaseSprintDto, [
  'title',
  'goal',
  'startDate',
  'endDate',
  'projectId',
]) {}
export class CreateSprintResponseDto extends PickType(BaseSprintDto, ['id']) {}
