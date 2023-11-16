import { IsInt, IsNotEmpty } from 'class-validator';

export class deleteBacklogsEpicDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsInt()
  @IsNotEmpty()
  epicId: number;
}
