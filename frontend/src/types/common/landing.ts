import {
  LandingDTO,
  LandingLinkDTO,
  LandingMemberDTO,
  LandingMemoDTO,
} from "../DTO/landingDTO";

export enum LandingSocketDomain {
  INIT = "landing",
  MEMO = "memo",
  MEMBER = "member",
  LINK = "link",
  INVITE_LINK = "inviteLink",
}

export enum LandingSocketMemoAction {
  CREATE = "create",
  DELETE = "delete",
  COLOR_UPDATE = "colorUpdate",
}

export enum LandingSocketMemberAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export enum LandingSocketLinkAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export enum LandingSocketInviteLinkAction {
  UPDATE = "update",
}

interface LandingSocketInitData {
  domain: LandingSocketDomain.INIT;
  action: "init";
  content: LandingDTO;
}

interface LandingSocketMemoData {
  domain: LandingSocketDomain.MEMO;
  action: LandingSocketMemoAction;
  content: LandingMemoDTO;
}

interface LandingSocketMemberData {
  domain: LandingSocketDomain.MEMBER;
  action: LandingSocketMemberAction;
  content: LandingMemberDTO | { id: number };
}

interface LandingSocketLinkData {
  domain: LandingSocketDomain.LINK;
  action: LandingSocketLinkAction;
  content: LandingLinkDTO;
}

interface LandingSocketInviteLinkData {
  domain: LandingSocketDomain.INVITE_LINK;
  action: LandingSocketInviteLinkAction;
  content: { inviteLinkId: string };
}

export type LandingSocketData =
  | LandingSocketInitData
  | LandingSocketMemoData
  | LandingSocketMemberData
  | LandingSocketLinkData
  | LandingSocketInviteLinkData;

export enum MemoColorStyle {
  yellow = "bg-[#FFD966]",
  red = "bg-[#FFAFA3]",
  blue = "bg-[#80CAFF]",
  gray = "bg-[#D9D9D9]",
}

export type MemoColorType = "yellow" | "red" | "blue" | "gray";
