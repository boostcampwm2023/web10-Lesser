import { TaskStatus } from 'src/project/entity/task.entity';

class Task {
  id: number;
  storyId?: number;
  title?: string;
  expectedTime?: number;
  actualTime?: number;
  status?: TaskStatus;
  assignedMemberId?: number;

  static of(
    id: number,
    storyId: number | undefined,
    title: string | undefined,
    expectedTime: number | undefined,
    actualTime: number | undefined,
    status: TaskStatus | undefined,
    assignedMemberId: number | undefined,
  ) {
    const dto = new Task();
    dto.id = id;
    if (storyId !== undefined) dto.storyId = storyId;
    if (title !== undefined) dto.title = title;
    if (expectedTime !== undefined) dto.expectedTime = expectedTime;
    if (actualTime !== undefined) dto.actualTime = actualTime;
    if (status !== undefined) dto.status = status;
    if (assignedMemberId !== undefined) dto.assignedMemberId = assignedMemberId;
    return dto;
  }
}

export class TaskUpdateNotifyDto {
  domain: string;
  action: string;
  content: Task;

  static of(
    id: number,
    storyId: number | undefined,
    title: string | undefined,
    expectedTime: number | undefined,
    actualTime: number | undefined,
    status: TaskStatus | undefined,
    assignedMemberId: number | undefined,
  ) {
    const dto = new TaskUpdateNotifyDto();
    dto.domain = 'task';
    dto.action = 'update';
    dto.content = Task.of(
      id,
      storyId,
      title,
      expectedTime,
      actualTime,
      status,
      assignedMemberId,
    );
    return dto;
  }
}
