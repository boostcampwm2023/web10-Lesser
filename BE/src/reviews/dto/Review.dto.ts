import { PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

class BaseReviewDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  sprintId: number;
}

export class CreateReviewRequestDto extends PickType(BaseReviewDto, ['content', 'sprintId']) {}
export class CreateReviewResponseDto extends PickType(BaseReviewDto, ['id']) {}
