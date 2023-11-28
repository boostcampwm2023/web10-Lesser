export type TaskGroup = 'all' | 'story';

export type UserFilter = '전체' | string;

export type TaskState = 'ToDo' | 'InProgress' | 'Done';

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
