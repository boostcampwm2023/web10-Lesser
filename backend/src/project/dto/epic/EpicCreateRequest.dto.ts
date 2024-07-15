import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { EpicColor } from 'src/project/entity/epic.entity';

class Epic {
  @IsString()
  @Length(1, 10)
  name: string;

  @IsEnum(EpicColor)
  color: EpicColor;
}

export class EpicCreateRequestDto {
  @Matches(/^create$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Epic)
  content: Epic;
}
