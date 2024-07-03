import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { EpicColor } from 'src/project/entity/epic.entity';

class Epic {
  @IsString()
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
