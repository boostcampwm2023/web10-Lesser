import { BacklogDTO, EpicDTO } from "../DTO/backlogDTO";

export type BacklogPath = "backlog" | "epic" | "completed";

export type BacklogCategoryColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "gray";

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

export type BacklogSocketData = BacklogSocketInitData | BacklogSocketEpicData;
