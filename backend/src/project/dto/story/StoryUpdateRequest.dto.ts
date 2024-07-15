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
import { StoryStatus } from 'src/project/entity/story.entity';

class Story {
  @IsInt()
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
}

export class StoryUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Story)
  content: Story;
}
