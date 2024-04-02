import { ProjectSidebarProps } from "../../types/main";
import PageLinkIcons from "./PageLinkIcons";
import UtilIcons from "./UtilIcons";

const ProjectSidebar = ({ pathname, projectId }: ProjectSidebarProps) => {
  return (
    <div className="flex flex-col justify-between h-[40.5rem] bg-gradient-to-t from-sidebar-linear-from to-sidebar-linear-to rounded-lg shadow-box z-10">
      <PageLinkIcons {...{ pathname, projectId }} />
      <UtilIcons {...{ pathname, projectId }} />
    </div>
  );
};

export default ProjectSidebar;
