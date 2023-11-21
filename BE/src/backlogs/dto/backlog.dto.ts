import { OmitType, PickType } from '@nestjs/swagger';
import { baseEpicDto, baseStoryDto, baseTaskDto } from './baseType.dto';

export class MTask extends OmitType(baseTaskDto, ['storyId', 'userId']) {
  userName: string;
}

export class MStory extends PickType(baseStoryDto, ['id', 'title']) {
  taskList: MTask[];
}

export class MEpic extends PickType(baseEpicDto, ['id', 'title']) {
  storyList: MStory[];
}

export class ReadBacklogResponseDto {
  epicList: MEpic[];
}
