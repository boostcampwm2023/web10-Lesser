import { Socket } from "socket.io-client";
import { LandingDTO, LandingProjectDTO } from "../../../types/DTO/landingDTO";
import formatDate from "../../../utils/formatDate";
import LandingProjectLink from "./LandingProjectLink";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { DEFAULT_VALUE } from "../../../constants/landing";
import {
  LandingSocketData,
  LandingSocketDomain,
} from "../../../types/common/landing";

interface LandingProjectProps {
  projectId: string;
}

const LandingProject = ({ projectId }: LandingProjectProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const [project, setProject] = useState<LandingProjectDTO>(
    DEFAULT_VALUE.PROJECT
  );

  const handleInitEvent = (content: LandingDTO) => {
    const { project } = content as LandingDTO;
    setProject(project);
  };

  const handleOnLanding = ({ domain, content }: LandingSocketData) => {
    if (domain !== LandingSocketDomain.INIT) return;
    handleInitEvent(content);
  };

  useEffect(() => {
    socket.emit("joinLanding");
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing");
    };
  }, [socket]);

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
