export type EpicColor =
  | "yellow"
  | "gray"
  | "red"
  | "purple"
  | "blue"
  | "green"
  | "orange";

export type BacklogStatusType = "시작전" | "진행중" | "완료";

export interface TaskDTO {
  id: number;
  displayId: number;
  title: string;
  expectedTime: number | null;
  actualTime: number | null;
  status: BacklogStatusType;
  assignedMemberId: number;
}

export interface StoryDTO {
  id: number;
  title: string;
  point: number | null;
  status: BacklogStatusType;
  taskList: TaskDTO[];
}

export interface EpicDTO {
  id: number;
  name: string;
  color: EpicColor;
  storyList: StoryDTO[];
}
