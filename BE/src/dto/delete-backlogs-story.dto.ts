import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteBacklogsStoryDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsInt()
  @IsNotEmpty()
  storyId: number;
}
