import { ReadBacklogEpicResponseDto, ReadBacklogStoryResponseDto, ReadBacklogTaskResponseDto } from './backlog';

export type TaskGroup = 'all' | 'story';

export type UserFilter = number;

export type TaskState = 'ToDo' | 'InProgress' | 'Done' | string;

export interface Task {
  id: number;
  sequence: number;
  title: string;
  userId: number;
  point: number;
  state: TaskState;
  storyId: number;
  storySequence: number;
  storyTitle: string;
  condition: string;
}

export interface SprintBacklogEpic extends ReadBacklogEpicResponseDto {
  storyList: SprintBacklogStory[];
}

export interface SprintBacklogStory extends ReadBacklogStoryResponseDto {
  taskList: SprintBacklogTask[];
}

export interface SprintBacklogTask extends ReadBacklogTaskResponseDto {
  epicIndex: number;
  storyIndex: number;
  taskIndex: number;
}

export interface SprintCreateBody {
  projectId: number;
  taskList: number[];
  goal: string;
  startDate: string;
  endDate: string;
  title: string;
}

export interface BoardTaskObject {
  storyId?: number;
  storySequence?: number;
  storyTitle?: string;
  ToDo: Task[];
  InProgress: Task[];
  Done: Task[];
}

export type TaskGroupedByStory = Record<number, BoardTaskObject>;

export interface Sprint {
  sprintId: number;
  sprintTitle: string;
  sprintGoal: string;
  sprintStartDate: string;
  sprintEndDate: string;
  sprintEnd: boolean;
  sprintModal: boolean;
  taskList: Task[];
}

export interface ReturnedSprint extends Sprint {
  boardTask: Record<number, BoardTaskObject>;
}
