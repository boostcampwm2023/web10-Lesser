import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Matches, ValidateNested } from 'class-validator';

class Epic {
  @IsInt()
  id: number;
}

export class EpicDeleteRequestDto {
  @Matches(/^delete$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Epic)
  content: Epic;
}
