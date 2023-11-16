import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBacklogsEpicDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  epicTitle: string;
}
