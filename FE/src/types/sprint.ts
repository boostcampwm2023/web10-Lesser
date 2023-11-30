export type TaskGroup = 'all' | 'story';

export type UserFilter = undefined | number;

export type TaskState = 'ToDo' | 'InProgress' | 'Done' | string;

export interface Task {
  id: number;
  sequencd: number;
  title: string;
  userId: number;
  point: number;
  state: TaskState;
  storyId: number;
  storySequence: number;
  storyTitle: string;
  condition: string;
}
