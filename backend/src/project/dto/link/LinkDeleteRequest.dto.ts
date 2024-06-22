import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Matches, ValidateNested } from 'class-validator';

class Link {
  @IsNumber()
  id: number;
}

export class LinkDeleteRequestDto {
  @Matches(/^delete$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Link)
  content: Link;
}
