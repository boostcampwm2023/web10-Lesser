import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { LandingDTO, LandingLinkDTO } from "../../../types/DTO/landingDTO";
import {
  LandingSocketData,
  LandingSocketDomain,
  LandingSocketLinkAction,
} from "../../../types/common/landing";

const useLandingLinkSocket = (socket: Socket) => {
  const [link, setLink] = useState<LandingLinkDTO[]>([]);
  const handleInitEvent = (content: LandingDTO) => {
    const { link } = content as LandingDTO;
    setLink(link);
  };

  const handleLinkEvent = (
    action: LandingSocketLinkAction,
    content: LandingLinkDTO
  ) => {
    switch (action) {
      case LandingSocketLinkAction.CREATE:
        setLink([...link, content]);
        break;
    }
  };

  const handleOnLanding = ({ domain, action, content }: LandingSocketData) => {
    switch (domain) {
      case LandingSocketDomain.INIT:
        handleInitEvent(content);
        break;
      case LandingSocketDomain.LINK:
        handleLinkEvent(action, content);
        break;
    }
  };

  const emitLinkCreateEvent = (content: {
    url: string;
    description: string;
  }) => {
    socket.emit("link", { action: "create", content });
  };

  useEffect(() => {
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing", handleOnLanding);
    };
  }, []);

  return { link, emitLinkCreateEvent };
};

export default useLandingLinkSocket;
