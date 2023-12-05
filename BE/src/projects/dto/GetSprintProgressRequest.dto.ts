import { PickType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { baseTaskDto } from 'src/backlogs/dto/baseType.dto';

export class GetSprintProgressTaskResponseDto extends PickType(baseTaskDto, [
  'id',
  'title',
  'userId',
  'sequence',
  'point',
  'state',
  'condition',
]) {
  'storyId': number;

  'storySequence': number;

  'storyTitle': string;
}

export class GetSprintProgressResponseDto {
  sprintId: number;

  sprintTitle: string;

  sprintGoal: string;

  sprintStartDate: Date;

  sprintEndDate: Date;

  sprintEnd: boolean;

  sprintModal: boolean;

  taskList: GetSprintProgressTaskResponseDto[];
}

export class GetSprintNotProgressResponseDto extends PickType(GetSprintProgressResponseDto, [
  'sprintEnd',
  'sprintModal',
]) {}
