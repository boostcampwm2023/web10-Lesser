import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { StoryStatus } from 'src/project/entity/story.entity';

class Story {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsInt()
  @Min(0)
  @Max(100)
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
