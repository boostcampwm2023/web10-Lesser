import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class createBacklogsEpicDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  epicTitle: string;
}
