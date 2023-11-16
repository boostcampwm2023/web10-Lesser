import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteBacklogsTaskDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsInt()
  @IsNotEmpty()
  taskId: number;
}
