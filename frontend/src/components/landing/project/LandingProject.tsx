import { Socket } from "socket.io-client";
import formatDate from "../../../utils/formatDate";
import LandingProjectLink from "./LandingProjectLink";
import { useOutletContext } from "react-router-dom";

import useLandingProjectSocket from "../../../hooks/common/landing/useLandingProjectSocket";

interface LandingProjectProps {
  projectId: string;
}

const LandingProject = ({ projectId }: LandingProjectProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const { project } = useLandingProjectSocket(socket);

  return (
    <div className="flex flex-col justify-between w-full p-6 rounded-lg shadow-box">
      <div className="flex items-baseline justify-between font-bold text-middle-green">
        <p className="text-xl">| {project.title}</p>
        <p className="text-xs">
          {project.createdAt && formatDate(project.createdAt)}
        </p>
      </div>
      <div className="text-xs">{project.subject}</div>
      <div className="flex justify-between">
        <LandingProjectLink projectId={projectId} type="BACKLOG" />
        <LandingProjectLink projectId={projectId} type="SPRINT" />
        <LandingProjectLink projectId={projectId} type="SETTINGS" />
      </div>
    </div>
  );
};

export default LandingProject;
