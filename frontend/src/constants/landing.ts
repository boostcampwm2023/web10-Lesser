import BacklogIcon from "../assets/icons/landing.svg?react";
import SprintIcon from "../assets/icons/sprint.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import linkIcon from "../assets/icons/Link.svg";
import githubLogo from "../assets/logo/Tech Logos/GitHub.svg";
import notionLogo from "../assets/logo/Tech Logos/Notion.svg";
import slackLogo from "../assets/logo/Tech Logos/Slack.svg";
import figmaLogo from "../assets/logo/Tech Logos/Figma.svg";
import gitlabLogo from "../assets/logo/Tech Logos/Gitlab.svg";
import googleLogo from "../assets/logo/Tech Logos/Google.svg";
import discordLogo from "../assets/logo/Tech Logos/discord.svg";
import youtubeLogo from "../assets/logo/Tech Logos/youtube.svg";
import naverLogo from "../assets/logo/Tech Logos/naver.png";
import { MemberStatus } from "../types/DTO/landingDTO";
import { MemoColorType } from "../types/common/landing";

export const DEFAULT_VALUE = {
  PROJECT: {
    title: "",
    subject: "",
    createdAt: "",
  },
  MY_INFO: {
    id: 0,
    username: "",
    imageUrl: "",
    status: "on" as MemberStatus,
  },
};

export const LANDING_PROJECT_LINK = {
  BACKLOG: {
    color: "bg-light-green",
    text: "백로그",
    Icon: BacklogIcon,
  },
  SPRINT: {
    color: "bg-middle-green",
    text: "스프린트",
    Icon: SprintIcon,
  },
  SETTINGS: {
    color: "bg-dark-green",
    text: "설정",
    Icon: SettingsIcon,
  },
};

export const LANDING_SPRINT_BAR = {
  SPRINT: {
    bgColor: "bg-light-green",
    color: "text-light-green",
    text: "스프린트 일정",
    display: (dataNum: number) =>
      dataNum === 0
        ? "D-day"
        : dataNum < 0
        ? `D-${Math.abs(dataNum)}`
        : `D+${dataNum}`,
  },
  TOTAL: {
    bgColor: "bg-middle-green",
    color: "text-middle-green",
    text: "전체 진행률",
    display: (dataNum: number) => `${dataNum}%`,
  },
  PERSONAL: {
    bgColor: "bg-dark-green",
    color: "text-dark-green",
    text: "내 진행률",
    display: (dataNum: number) => `${dataNum}%`,
  },
};

export const USER_STATE_DISPLAY = {
  on: {
    bgColor: "bg-middle-green",
    text: "접속 중",
  },
  off: {
    bgColor: "bg-light-gray",
    text: "부재 중",
  },
  away: {
    bgColor: "bg-warning-yellow",
    text: "자리 비움",
  },
};

export const LINK_LOGO_URL = {
  LINK: linkIcon,
  NAVER: naverLogo,
  GITHUB: githubLogo,
  GITLAB: gitlabLogo,
  SLACK: slackLogo,
  FIGMA: figmaLogo,
  NOTION: notionLogo,
  GOOGLE: googleLogo,
  DISCORD: discordLogo,
  YOUTUBE: youtubeLogo,
};

export const LINK_URL_TYPE = {
  NAVER: "naver.com",
  GITHUB: "github.com",
  GITLAB: "gitlab.com",
  SLACK: "slack.com",
  FIGMA: "figma.com",
  NOTION: "notion.so",
  GOOGLE: "google.com",
  DISCORD: "discord.com",
  YOUTUBE: "youtube.com",
};

export const USER_STATUS_WORD = {
  on: "접속 중",
  off: "부재 중",
  away: "자리비움",
};
type MyMap = {
  [key: string]: MemberStatus;
};

export const USER_WORD_STATUS: MyMap = {
  "접속 중": "on",
  "부재 중": "off",
  자리비움: "away",
};

type MemoColorMap = {
  [key: string]: MemoColorType;
};

export const MEMO_COLOR: MemoColorMap = {
  YELLOW: "yellow",
  BLUE: "blue",
  RED: "red",
  GRAY: "gray",
};
