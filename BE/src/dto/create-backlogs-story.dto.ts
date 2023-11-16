import { ValidateNested, IsInt, IsString } from 'class-validator';

class storyDto {
  @IsInt()
  epicId: number;
  @IsString()
  title: string;
}

export class createBacklogsStoryDto {
  @IsInt()
  projectId: number;

  @ValidateNested()
  story: storyDto;
}
