import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Matches, ValidateNested } from 'class-validator';

class Link {
  @IsInt()
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
