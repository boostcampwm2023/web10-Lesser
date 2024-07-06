import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { StoryStatus } from 'src/project/entity/story.entity';

class Story {
  @IsString()
  title: string;

  @IsInt()
  point: number;

  @IsEnum(StoryStatus)
  status: StoryStatus;

  @IsInt()
  epicId: number;
}

export class StoryCreateRequestDto {
  @Matches(/^create$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Story)
  content: Story;
}
