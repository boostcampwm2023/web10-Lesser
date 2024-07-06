import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { MemberStatus } from '../../enum/MemberStatus.enum';

class Content {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsEnum(MemberStatus)
  @IsOptional()
  status: MemberStatus;
}

export class MemberUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Content)
  content: Content;
}
