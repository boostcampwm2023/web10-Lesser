import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { baseTaskDto } from './baseType.dto';

export class CreateBacklogsTaskRequestDto extends OmitType(baseTaskDto, ['id']) {}
export class DeleteBacklogsTaskRequestDto extends PickType(baseTaskDto, ['id']) {}
export class UpdateBacklogsRequestTaskDto extends IntersectionType(
  PickType(baseTaskDto, ['id']),
  PartialType(OmitType(baseTaskDto, ['id'])),
) {}

export class CreateBacklogsTaskResponseDto extends PickType(baseTaskDto, ['id']) {}