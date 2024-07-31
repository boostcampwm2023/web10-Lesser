import { Epic, EpicColor } from '../entity/epic.entity';
import { Story, StoryStatus } from '../entity/story.entity';
import { Task, TaskStatus } from '../entity/task.entity';

class TaskDto {
  id: number;
  displayId: number;
  title: string;
  expectedTime: number | null;
  actualTime: number | null;
  status: TaskStatus;
  assignedMemberId: number | null;
  rankValue: string;

  static of(task: Task): TaskDto {
    const dto = new TaskDto();
    dto.id = task.id;
    dto.displayId = task.displayId;
    dto.title = task.title;
    dto.expectedTime = task.expectedTime;
    dto.actualTime = task.actualTime;
    dto.status = task.status;
    dto.assignedMemberId = task.assignedMemberId;
    dto.rankValue = task.rankValue;
    return dto;
  }
}

class StoryDto {
  id: number;
  title: string;
  point: number | null;
  status: StoryStatus;
  rankValue: string;
  taskList: TaskDto[];

  static of(story: Story): StoryDto {
    const dto = new StoryDto();
    dto.id = story.id;
    dto.title = story.title;
    dto.point = story.point;
    dto.status = story.status;
    dto.rankValue = story.rankValue;
    dto.taskList = story.taskList.map(TaskDto.of);
    return dto;
  }
}

class EpicDto {
  id: number;
  name: string;
  color: EpicColor;
  rankValue: string;
  storyList: StoryDto[];

  static of(epic: Epic): EpicDto {
    const dto = new EpicDto();
    dto.id = epic.id;
    dto.name = epic.name;
    dto.color = epic.color;
    dto.rankValue = epic.rankValue;
    dto.storyList = epic.storyList.map(StoryDto.of);
    return dto;
  }
}

class BacklogDto {
  backlog: { epicList: EpicDto[] };

  static of(epicList: Epic[]): BacklogDto {
    const dto = new BacklogDto();
    dto.backlog = { epicList: epicList.map(EpicDto.of) };
    return dto;
  }
}

export class InitBacklogResponseDto {
  domain: string;
  action: string;
  content: BacklogDto;

  static of(epicList: Epic[]): InitBacklogResponseDto {
    const dto = new InitBacklogResponseDto();
    dto.domain = 'backlog';
    dto.action = 'init';
    dto.content = BacklogDto.of(epicList);
    return dto;
  }
}
