import {
  BacklogDTO,
  EpicCategoryDTO,
  EpicDTO,
  StoryDTO,
} from "../DTO/backlogDTO";

export type BacklogPath = "backlog" | "epic" | "completed";

export type BacklogCategoryColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "gray";

export interface UnfinishedStory extends StoryDTO {
  epic: EpicCategoryDTO;
}

export interface StoryForm {
  epicId: number | undefined;
  title: string;
  point: number | undefined;
  status: "시작전";
}

export enum BacklogSocketDomain {
  BACKLOG = "backlog",
  EPIC = "epic",
  STORY = "story",
  TASK = "task",
}

export enum BacklogSocketEpicAction {
  CREATE = "create",
  DELETE = "delete",
  UPDATE = "update",
}

export enum BacklogSocketStoryAction {
  CREATE = "create",
  DELETE = "delete",
  UPDATE = "update",
}

export interface BacklogSocketInitData {
  domain: BacklogSocketDomain.BACKLOG;
  action: "init";
  content: { backlog: BacklogDTO };
}

export interface BacklogSocketEpicData {
  domain: BacklogSocketDomain.EPIC;
  action: BacklogSocketEpicAction;
  content: EpicDTO;
}

export interface BacklogSocketStoryData {
  domain: BacklogSocketDomain.STORY;
  action: BacklogSocketStoryAction;
  content: StoryDTO;
}

export type BacklogSocketData =
  | BacklogSocketInitData
  | BacklogSocketEpicData
  | BacklogSocketStoryData;
