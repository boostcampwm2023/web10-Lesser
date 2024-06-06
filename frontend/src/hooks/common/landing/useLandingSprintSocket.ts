import { Socket } from "socket.io-client";
import { LandingDTO, LandingSprintDTO } from "../../../types/DTO/landingDTO";
import { useEffect, useState } from "react";
import {
  LandingSocketData,
  LandingSocketDomain,
} from "../../../types/common/landing";

const useLandingSprintSocket = (socket: Socket) => {
  const [sprint, setSprint] = useState<LandingSprintDTO | null>(null);
  const handleInitEvent = (content: LandingDTO) => {
    const { sprint } = content as LandingDTO;
    setSprint(sprint);
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
  return { sprint };
};

export default useLandingSprintSocket;
