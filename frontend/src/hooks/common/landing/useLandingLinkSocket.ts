import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { LandingDTO, LandingLinkDTO } from "../../../types/DTO/landingDTO";
import {
  LandingSocketData,
  LandingSocketDomain,
  LandingSocketLinkAction,
} from "../../../types/common/landing";

const useLandingLinkSocket = (socket: Socket) => {
  const [linkList, setLinkList] = useState<LandingLinkDTO[]>([]);
  const handleInitEvent = (content: LandingDTO) => {
    const { linkList } = content as LandingDTO;
    setLinkList(linkList);
  };

  const handleLinkEvent = (
    action: LandingSocketLinkAction,
    content: LandingLinkDTO
  ) => {
    switch (action) {
      case LandingSocketLinkAction.CREATE:
        setLinkList((prevLinkList) => [...prevLinkList, content]);
        break;
      case LandingSocketLinkAction.DELETE:
        setLinkList((prevLinkList) =>
          prevLinkList.filter(({ id }) => id !== content.id)
        );
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

  const emitLinkDeleteEvent = (content: { id: number }) => {
    socket.emit("link", { action: "delete", content });
  };

  useEffect(() => {
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing", handleOnLanding);
    };
  }, []);

  return { linkList, emitLinkCreateEvent, emitLinkDeleteEvent };
};

export default useLandingLinkSocket;
