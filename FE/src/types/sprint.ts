export type TaskGroup = 'all' | 'story';

export type UserFilter = undefined | number;

export type TaskState = 'ToDo' | 'InProgress' | 'Done' | string;

export interface Task {
  id: number;
  title: string;
  userId: number;
  userName: string;
  point: number;
  state: TaskState;
  storyId: number;
  storyNumber: number;
  storyTitle: string;
  condition: string;
}
