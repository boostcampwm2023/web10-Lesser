import PageIcon from "./PageIcon";
import LandingIcon from "../../assets/icons/landing.svg?react";
import BacklogIcon from "../../assets/icons/backlog.svg?react";
import SprintIcon from "../../assets/icons/sprint.svg?react";
import SettingIcon from "../../assets/icons/settings.svg?react";
import { LINK_URL } from "../../constants/path";
import { ProjectSidebarProps } from "../../types/common/main";

const PageLinkIcons = ({ pathname, projectId }: ProjectSidebarProps) => (
  <div className="flex flex-col pl-[0.9375rem] pt-[1.5625rem] w-[5.3125rem] gap-5">
    <PageIcon
      Icon={LandingIcon}
      activated={pathname === LINK_URL.MAIN(projectId)}
      to={LINK_URL.MAIN(projectId)}
      pageName="메인페이지"
    />
    <PageIcon
      Icon={BacklogIcon}
      activated={pathname.split("/").includes("backlog")}
      to={LINK_URL.BACKLOG(projectId)}
      pageName="백로그"
    />
    <PageIcon
      Icon={SprintIcon}
      activated={pathname === LINK_URL.SPRINT(projectId)}
      to={LINK_URL.SPRINT(projectId)}
      pageName="스프린트"
    />
    <PageIcon
      Icon={SettingIcon}
      activated={pathname === LINK_URL.SETTINGS(projectId)}
      to={LINK_URL.SETTINGS(projectId)}
      pageName="프로젝트 설정"
    />
  </div>
);

export default PageLinkIcons;
