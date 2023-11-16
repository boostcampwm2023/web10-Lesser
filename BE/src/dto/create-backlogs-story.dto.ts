import { Type } from 'class-transformer';
import { ValidateNested, IsInt, IsString, IsNotEmpty } from 'class-validator';

class storyDto {
  @IsInt()
  @IsNotEmpty()
  epicId: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class createBacklogsStoryDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @Type(() => storyDto)
  @ValidateNested()
  @IsNotEmpty()
  story: storyDto;
}
