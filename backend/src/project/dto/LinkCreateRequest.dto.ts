import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';

class Link {
  @IsString()
  url: string;

  @IsString()
  description: string;
}

export class LinkCreateRequestDto {
  @Matches(/^create$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Link)
  content: Link;
}
