import { LINK_URL, ROUTER_URL } from "../../constants/path";
import { DEFAULT_MEMBER } from "../../constants/projects";
import { ProjectSidebarProps } from "../../types/common/main";
import PageIcon from "./PageIcon";
import PageOutIcon from "../../assets/icons/pageout.svg?react";
import NotificationIcon from "../../assets/icons/notifications.svg?react";
import MemberIcon from "../../assets/icons/member.svg?react";
import ProfileImage from "../common/ProfileImage";

const UtilIcons = ({ pathname, projectId }: ProjectSidebarProps) => {
  const { imageUrl } = JSON.parse(window.localStorage.getItem("member") ?? DEFAULT_MEMBER);
  return (
    <div className="flex flex-col pl-[0.9375rem] pb-[1.875rem] w-[5.3125rem] gap-5">
      {pathname !== LINK_URL.MAIN(projectId) && (
        <button>
          <MemberIcon width={24} height={24} fill="#FFFFFF" className="ml-[0.96875rem]" />
        </button>
      )}
      <button>
        <NotificationIcon width={24} height={24} fill={"#FFFFFF"} className="ml-[0.96875rem]" />
      </button>
      <PageIcon
        Icon={PageOutIcon}
        activated={false}
        to={ROUTER_URL.PROJECTS}
        pageName="내 프로젝트"
      />
      <ProfileImage imageUrl={imageUrl} pxSize={40} />
    </div>
  );
};

export default UtilIcons;
