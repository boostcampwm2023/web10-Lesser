import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, Matches, ValidateNested } from 'class-validator';
import { memoColor } from '../../entity/memo.entity';

class Color {
  @IsEnum(memoColor)
  color: memoColor;
}

export class MemoCreateRequestDto {
  @Matches(/^create$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Color)
  content: Color;
}
