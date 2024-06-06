import { Outlet, useLocation, useParams } from "react-router-dom";
import ProjectSidebar from "../../components/main/ProjectSidebar";
import useSocket from "../../hooks/common/socket/useSocket";
import useAwayUser from "../../hooks/common/useAwayUser";

const MainPage = () => {
  const { pathname } = useLocation();
  const { projectId } = useParams();
  if (!projectId) {
    throw Error("잘못된 ProjectID 입니다.");
  }
  const { socket } = useSocket(projectId);
  const userStatusEventListener = useAwayUser(socket);

  return (
    <div className="flex justify-center items-center h-screen min-w-[76rem] gap-9">
      <ProjectSidebar {...{ pathname, projectId }} />
      <div className="h-[40.5rem] min-w-[67.9375rem]">
        <Outlet context={{ socket, ...userStatusEventListener }} />
      </div>
    </div>
  );
};

export default MainPage;
