import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { IsLexoRankValue } from 'src/common/decorator/IsLexoRankValue';
import { TaskStatus } from 'src/project/entity/task.entity';
import { AtLeastOneProperty } from 'src/project/util/validation.util';
import { IsOneDecimalPlace } from './TaskCreateRequest.dto';

class Task {
  @IsInt()
  @AtLeastOneProperty([
    'storyId',
    'title',
    'expectedTime',
    'actualTime',
    'assignedMemberId',
    'status',
    'rankValue',
  ])
  id: number;

  @IsOptional()
  @IsInt()
  storyId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsOneDecimalPlace()
  expectedTime?: number;

  @IsOptional()
  @IsOneDecimalPlace()
  actualTime?: number;

  @IsOptional()
  @IsInt()
  assignedMemberId?: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @IsLexoRankValue()
  @Length(2, 255)
  rankValue?: string;
}

export class TaskUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Task)
  content: Task;
}
