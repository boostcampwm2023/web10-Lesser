import { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import {
  LandingDTO,
  LandingLinkDTO,
  LandingMemberDTO,
  LandingMemoDTO,
  LandingProjectDTO,
  LandingSprintDTO,
} from "../../../types/DTO/landingDTO";
import { DEFAULT_VALUE } from "../../../constants/landing";

interface SocketData {
  action: LandingSocketEvent;
  content: LandingDTO;
}

enum LandingSocketEvent {
  INIT = "init",
  MEMBER_UPDATE = "memberUpdate",
  MEMBER_CREATE = "memberCreate",
  MEMBER_DELETE = "memberDelete",
}

const useLandingSocket = (socket: Socket) => {
  const [project, setProject] = useState<LandingProjectDTO>(
    DEFAULT_VALUE.PROJECT
  );
  const [myInfo, setMyInfo] = useState<LandingMemberDTO>(DEFAULT_VALUE.MY_INFO);
  const [member, setMember] = useState<LandingMemberDTO[]>([]);
  const [sprint, setSprint] = useState<LandingSprintDTO | null>(null);
  const [memoList, setMemoList] = useState<LandingMemoDTO[]>([]);
  const [link, setLink] = useState<LandingLinkDTO[]>([]);
  const inviteLinkIdRef = useRef<string>("");

  const handleInitEvent = (content: LandingDTO) => {
    const { project, myInfo, member, sprint, memoList, link, inviteLinkId } =
      content as LandingDTO;
    setProject(project);
    setMyInfo(myInfo);
    setMember(member);
    setSprint(sprint);
    setMemoList(memoList);
    setLink(link);
    inviteLinkIdRef.current = inviteLinkId;
  };

  const handleOnLanding = ({ action, content }: SocketData) => {
    switch (action) {
      case LandingSocketEvent.INIT:
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

  return { project, myInfo, member, sprint, memoList, link, inviteLinkIdRef };
};

export default useLandingSocket;
