import { PickType } from '@nestjs/swagger';
import { baseEpicDto } from './baseType.dto';

export class CreateBacklogsEpicRequestDto extends PickType(baseEpicDto, ['projectId', 'title']) {}
export class UpdateBacklogsEpicRequestDto extends PickType(baseEpicDto, ['id', 'title']) {}
export class DeleteBacklogsEpicRequestDto extends PickType(baseEpicDto, ['id']) {}

export class CreateBacklogsEpicResponseDto extends PickType(baseEpicDto, ['id', 'sequence']) {}
