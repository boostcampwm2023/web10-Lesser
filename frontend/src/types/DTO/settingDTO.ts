import { MemberRole } from "./landingDTO";

export interface SettingProjectDTO {
  title: string;
  subject: string;
}

export interface SettingMemberDTO {
  id: number;
  username: string;
  imageUrl: string;
  role: MemberRole;
}

export interface SettingDTO {
  project: SettingProjectDTO;
  member: SettingMemberDTO[];
}
