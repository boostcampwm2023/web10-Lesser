import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { StoryStatus } from 'src/project/entity/story.entity';

class Story {
  @IsInt()
  id: number;

  @IsOptional()
  @IsInt()
  epicId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  point?: number;

  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;
}

export class StoryUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Story)
  content: Story;
}
