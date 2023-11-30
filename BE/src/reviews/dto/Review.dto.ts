import { PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class BaseReviewDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsInt()
  @IsNotEmpty()
  sprintId: number;
}

export class CreateReviewRequestDto extends PickType(BaseReviewDto, ['content', 'sprintId']) {}
export class CreateReviewResponseDto extends PickType(BaseReviewDto, ['id']) {}
export class ReadReviewResponseDto extends PickType(BaseReviewDto, ['id', 'content']) {}
