import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsNotEmpty } from 'class-validator';

class StoryDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateBacklogsStoryDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @Type(() => StoryDto)
  @ValidateNested()
  @IsNotEmpty()
  story: StoryDto;
}
