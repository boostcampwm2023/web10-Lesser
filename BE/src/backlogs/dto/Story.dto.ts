import { PickType } from '@nestjs/swagger';
import { baseStoryDto } from './baseType.dto';

export class CreateBacklogsStoryRequestDto extends PickType(baseStoryDto, ['epicId', 'title']) {}
export class UpdateBacklogsStoryRequestDto extends PickType(baseStoryDto, ['id', 'title']) {}
export class DeleteBacklogsStoryRequestDto extends PickType(baseStoryDto, ['id']) {}

export class CreateBacklogsStoryResponseDto extends PickType(baseStoryDto, ['id']) {}
