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
  assignedMemberId: number | null;
  storyId: number;
  rankValue: string;
}

export interface StoryDTO {
  id: number;
  title: string;
  point: number | null;
  status: BacklogStatusType;
  taskList: TaskDTO[];
  epicId: number;
  rankValue: string;
}

export interface EpicCategoryDTO {
  id: number;
  name: string;
  color: EpicColor;
  rankValue: string;
}

export interface EpicDTO extends EpicCategoryDTO {
  storyList: StoryDTO[];
}

export interface BacklogDTO {
  epicList: EpicDTO[];
}
