import { OmitType, PickType } from '@nestjs/swagger';
import { baseEpicDto, baseStoryDto, baseTaskDto } from './baseType.dto';

export class ReadBacklogTaskResponseDto extends OmitType(baseTaskDto, ['storyId']) {}

export class ReadBacklogStoryResponseDto extends PickType(baseStoryDto, ['id', 'title', 'sequence']) {
  taskList: ReadBacklogTaskResponseDto[];
}

export class ReadBacklogEpicResponseDto extends PickType(baseEpicDto, ['id', 'title', 'sequence']) {
  storyList: ReadBacklogStoryResponseDto[];
}

export class ReadBacklogResponseDto {
  epicList: ReadBacklogEpicResponseDto[];
}
