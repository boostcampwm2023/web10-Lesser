import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteBacklogsEpicDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsInt()
  @IsNotEmpty()
  epicId: number;
}
