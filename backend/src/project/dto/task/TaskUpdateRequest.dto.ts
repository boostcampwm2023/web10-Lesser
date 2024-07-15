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
import { TaskStatus } from 'src/project/entity/task.entity';
import { IsOneDecimalPlace } from './TaskCreateRequest.dto';

class Task {
  @IsInt()
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
}

export class TaskUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Task)
  content: Task;
}
