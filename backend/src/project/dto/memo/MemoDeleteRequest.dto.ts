import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Matches, ValidateNested } from 'class-validator';

class MemoId {
  @IsInt()
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
