import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Matches, ValidateNested } from 'class-validator';

class Task {
  @IsInt()
  id: number;
}

export class TaskDeleteRequestDto {
  @Matches(/^delete$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Task)
  content: Task;
}
