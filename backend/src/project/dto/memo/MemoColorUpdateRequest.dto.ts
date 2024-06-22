import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Matches,
  ValidateNested,
} from 'class-validator';
import { memoColor } from '../../entity/memo.entity';

class Content {
  @IsNumber()
  id: number;

  @IsEnum(memoColor)
  color: memoColor;
}

export class MemoColorUpdateRequestDto {
  @Matches(/^colorUpdate$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Content)
  content: Content;
}
