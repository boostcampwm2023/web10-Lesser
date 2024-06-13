import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { LandingDTO, LandingProjectDTO } from "../../../types/DTO/landingDTO";
import { DEFAULT_VALUE } from "../../../constants/landing";
import {
  LandingSocketData,
  LandingSocketDomain,
} from "../../../types/common/landing";

const useLandingSocket = (socket: Socket) => {
  const [project, setProject] = useState<LandingProjectDTO>(
    DEFAULT_VALUE.PROJECT
  );

  const handleInitEvent = (content: LandingDTO) => {
    const { project } = content as LandingDTO;
    setProject(project);
  };

  const handleOnLanding = ({ domain, content }: LandingSocketData) => {
    switch (domain) {
      case LandingSocketDomain.INIT:
        handleInitEvent(content);
        break;
    }
  };

  useEffect(() => {
    socket.emit("joinLanding");
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing");
    };
  }, [socket]);

  return {
    project,
  };
};

export default useLandingSocket;
