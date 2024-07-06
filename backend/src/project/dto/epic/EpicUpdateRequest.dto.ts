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
import { EpicColor } from 'src/project/entity/epic.entity';

class Epic {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(EpicColor)
  color?: EpicColor;
}

export class EpicUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Epic)
  content: Epic;
}
