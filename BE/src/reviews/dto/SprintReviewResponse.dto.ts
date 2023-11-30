import { IsInt, IsNotEmpty, IsString } from 'class-validator';

class SprintListItem {
  @IsInt()
  @IsNotEmpty()
  sprintId: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

class TaskInfo {
  id: number;
  title: string;
  point: number;
  condition: string;
  memberId: number;
  completedAt?: Date;
}

class SprintInfo {
  id: number;
  title: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  closedDate: Date;
  completedCount: number;
  incompleteCount: number;
  taskList: TaskInfo[];
  remi: ReviewInfo
}

class ReviewInfo {
  id: number;
  content: string;
}

export class SprintReviewResponseDto {
  sprintList: SprintListItem[];
  selectedSprint: SprintInfo;
}