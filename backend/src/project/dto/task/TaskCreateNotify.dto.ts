import { Task, TaskStatus } from 'src/project/entity/task.entity';
class TaskDto {
  id: number;
  displayId: number;
  title: string;
  expectedTime: number|null;
  actualTime: number|null;
  status: TaskStatus;
  assignedMemberId: number|null;
  storyId: number;
  static of(task: Task) {
    const dto = new TaskDto();
    dto.id = task.id;
	dto.displayId = task.displayId;
    dto.title = task.title;
    dto.expectedTime = task.expectedTime;
    dto.actualTime = task.actualTime;
    dto.status = task.status;
    dto.assignedMemberId = task.assignedMemberId;
    dto.storyId = task.storyId;
    return dto;
  }
}

export class TaskCreateNotifyDto {
  domain: string;
  action: string;
  content: TaskDto;

  static of(task: Task) {
    const dto = new TaskCreateNotifyDto();
    dto.domain = 'task';
    dto.action = 'create';
    dto.content = TaskDto.of(task);
    return dto;
  }
}
