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

export interface SettingJoinRequestDTO {
  id: number;
  memberId: number;
  username: string;
  imageUrl: string;
}

export interface SettingDTO {
  project: SettingProjectDTO;
  member: SettingMemberDTO[];
  joinRequestList: SettingJoinRequestDTO[];
}
