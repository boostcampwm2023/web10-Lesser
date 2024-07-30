import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsLexoRankValue } from 'src/common/decorator/IsLexoRankValue';
import { StoryStatus } from 'src/project/entity/story.entity';
import { AtLeastOneProperty } from 'src/project/util/validation.util';

class Story {
  @IsInt()
  @AtLeastOneProperty(['epicId', 'title', 'point', 'status', 'rankValue'])
  id: number;

  @IsOptional()
  @IsInt()
  epicId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  point?: number;

  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;

  @IsOptional()
  @IsString()
  @IsLexoRankValue()
  @Length(2, 255)
  rankValue?: string;
}

export class StoryUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Story)
  content: Story;
}
