export type TaskGroup = 'all' | 'story';

export type UserFilter = '전체' | string;

export interface Task {
  id: number;
  title: string;
  userName: string;
  point: number;
  state: 'ToDo' | 'InProgress' | 'Done';
  storyTitle: string;
}
