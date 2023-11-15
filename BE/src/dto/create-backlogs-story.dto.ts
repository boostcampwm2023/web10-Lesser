import { ValidateNested, IsInt } from 'class-validator';

class storyDto {
  epicId: number;
  title: string;
}

export class createBacklogsStoryDto {
  @IsInt()
  projectId: number;

  @ValidateNested()
  story: storyDto;
}
