import { PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

class BaseReviewDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateReviewRequestDto extends BaseReviewDto {
  @IsInt()
  @IsNotEmpty()
  sprintId: number;
}

export class CreateReviewResponseDto extends PickType(BaseReviewDto, ['id']) {}

export class ReadReviewResponseDto extends PickType(BaseReviewDto, ['id', 'content']) {}

export class UpdateReviewRequestDto extends PickType(BaseReviewDto, ['id', 'content']) {}

export class UpdateReviewResponseDto extends PickType(BaseReviewDto, ['id', 'content']) {}
