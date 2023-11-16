import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsNotEmpty } from 'class-validator';

class StoryDto {
  @IsInt()
  @IsNotEmpty()
  epicId: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class CreateBacklogsStoryDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @Type(() => StoryDto)
  @ValidateNested()
  @IsNotEmpty()
  story: StoryDto;
}
