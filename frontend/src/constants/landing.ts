import BacklogIcon from "../assets/icons/landing.svg?react";
import SprintIcon from "../assets/icons/sprint.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";

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
    display: (dataNum: number) => `D-${dataNum}`,
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
