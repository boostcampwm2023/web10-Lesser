import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { LandingDTO, LandingLinkDTO } from "../../../types/DTO/landingDTO";
import {
  LandingSocketData,
  LandingSocketDomain,
} from "../../../types/common/landing";

const useLandingLinkSocket = (socket: Socket) => {
  const [link, setLink] = useState<LandingLinkDTO[]>([]);
  const handleInitEvent = (content: LandingDTO) => {
    const { link } = content as LandingDTO;
    setLink(link);
  };

  const handleOnLanding = ({ domain, content }: LandingSocketData) => {
    if (domain !== LandingSocketDomain.INIT) return;
    handleInitEvent(content);
  };

  useEffect(() => {
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing");
    };
  });

  return { link };
};

export default useLandingLinkSocket;
