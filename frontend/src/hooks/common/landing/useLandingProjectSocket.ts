import { Socket } from "socket.io-client";
import { LandingDTO, LandingProjectDTO } from "../../../types/DTO/landingDTO";
import { useEffect, useState } from "react";
import { DEFAULT_VALUE } from "../../../constants/landing";
import {
  LandingSocketData,
  LandingSocketDomain,
} from "../../../types/common/landing";

const useLandingProjectSocket = (socket: Socket) => {
  const [project, setProject] = useState<LandingProjectDTO>(
    DEFAULT_VALUE.PROJECT
  );

  const handleInitEvent = (content: LandingDTO) => {
    const { project } = content as LandingDTO;
    setProject(project);
  };

  const handleOnLanding = ({ domain, content }: LandingSocketData) => {
    if (domain !== LandingSocketDomain.INIT) {
      return;
    }
    handleInitEvent(content);
  };

  useEffect(() => {
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing", handleOnLanding);
    };
  }, []);
  return { project };
};

export default useLandingProjectSocket;
