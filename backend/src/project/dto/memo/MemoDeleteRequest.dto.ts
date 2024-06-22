import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Matches, ValidateNested } from 'class-validator';

class MemoId {
  @IsNumber()
  id: number;
}

export class MemoDeleteRequestDto {
  @Matches(/^delete$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MemoId)
  content: MemoId;
}
