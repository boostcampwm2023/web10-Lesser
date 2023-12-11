import { ReactElement } from 'react';

export interface CompositionComponentProps {
  children: ReactElement;
}

export interface ReadBacklogTaskResponseDto {
  userId: string | number | null;
  id: number;
  title: string;
  point: number;
  condition: string;
  sequence: number;
  state: 'Todo' | 'InProgress' | 'Done' | string;
}

export interface ReadBacklogStoryResponseDto {
  taskList: Array<ReadBacklogTaskResponseDto>;
  id: number;
  title: string;
  sequence: number;
}

export interface ReadBacklogEpicResponseDto {
  storyList: Array<ReadBacklogStoryResponseDto>;
  id: number;
  title: string;
  sequence: number;
}

export type ModalChildElement = (props: { isOpen: boolean; close: () => void }) => JSX.Element;
