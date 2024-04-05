import { LINK_URL_TYPE } from "../constants/landing";

const getLinkType = (url: string) => {
  const linkUrl = url
    .replace("https://www.", "")
    .replace("https://", "")
    .split("/")[0]
    .split(".")
    .slice(-2)
    .join(".");
  switch (linkUrl) {
    case LINK_URL_TYPE.GITHUB:
      return "GITHUB";
    case LINK_URL_TYPE.NAVER:
      return "NAVER";
    case LINK_URL_TYPE.GITLAB:
      return "GITLAB";
    case LINK_URL_TYPE.SLACK:
      return "SLACK";
    case LINK_URL_TYPE.FIGMA:
      return "FIGMA";
    case LINK_URL_TYPE.NOTION:
      return "NOTION";
    case LINK_URL_TYPE.GOOGLE:
      return "GOOGLE";
    case LINK_URL_TYPE.DISCORD:
      return "DISCORD";
    case LINK_URL_TYPE.YOUTUBE:
      return "YOUTUBE";
    default:
      return "LINK";
  }
};

export default getLinkType;
