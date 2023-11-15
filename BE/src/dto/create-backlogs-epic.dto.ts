import { IsString, IsInt } from 'class-validator';

export class createBacklogsEpicDto {
  @IsInt()
  projectId: number;

  @IsString()
  epicTitle: string;
}
