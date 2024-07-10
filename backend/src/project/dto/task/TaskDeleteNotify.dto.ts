class Task {
  id: number;
  static of(id: number) {
    const dto = new Task();
    dto.id = id;
    return dto;
  }
}

export class TaskDeleteNotifyDto {
  domain: string;
  action: string;
  content: Task;

  static of(id: number) {
    const dto = new TaskDeleteNotifyDto();
    dto.domain = 'task';
    dto.action = 'delete';
    dto.content = Task.of(id);
    return dto;
  }
}
