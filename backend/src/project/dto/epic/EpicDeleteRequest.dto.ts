import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Matches, ValidateNested } from 'class-validator';

class Epic {
  @IsNumber()
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
