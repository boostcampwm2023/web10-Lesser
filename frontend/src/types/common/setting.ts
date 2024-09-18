import { SettingDTO, SettingProjectDTO } from "../DTO/settingDTO";

export enum SettingSocketDomain {
  INIT = "setting",
  PROJECT_INFO = "projectInfo",
}

export enum SettingSocketProjectInfoAction {
  UPDATE = "update",
  DELETE = "delete",
}

interface SettingSocketInitData {
  domain: SettingSocketDomain.INIT;
  action: "init";
  content: SettingDTO;
}

interface SettingSocketProjectInfoData {
  domain: SettingSocketDomain.PROJECT_INFO;
  action: SettingSocketProjectInfoAction;
  content: SettingProjectDTO;
}

export type SettingSocketData =
  | SettingSocketInitData
  | SettingSocketProjectInfoData;
