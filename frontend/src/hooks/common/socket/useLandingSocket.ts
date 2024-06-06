import { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import {
  LandingDTO,
  LandingMemberDTO,
  LandingProjectDTO,
} from "../../../types/DTO/landingDTO";
import { DEFAULT_VALUE } from "../../../constants/landing";
import {
  LandingSocketData,
  LandingSocketDomain,
} from "../../../types/common/landing";

const useLandingSocket = (socket: Socket) => {
  const [project, setProject] = useState<LandingProjectDTO>(
    DEFAULT_VALUE.PROJECT
  );
  const [myInfo, setMyInfo] = useState<LandingMemberDTO>(DEFAULT_VALUE.MY_INFO);
  const [member, setMember] = useState<LandingMemberDTO[]>([]);

  const inviteLinkIdRef = useRef<string>("");

  const handleInitEvent = (content: LandingDTO) => {
    const { project, myInfo, member, inviteLinkId } = content as LandingDTO;
    setProject(project);
    setMyInfo(myInfo);
    setMember(member);

    inviteLinkIdRef.current = inviteLinkId;
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
    myInfo,
    member,
    inviteLinkIdRef,
  };
};

export default useLandingSocket;
