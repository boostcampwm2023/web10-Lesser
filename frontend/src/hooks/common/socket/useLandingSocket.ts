import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
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
  content: any;
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
  const [board, setBoard] = useState<LandingMemoDTO[]>([]);
  const [link, setLink] = useState<LandingLinkDTO[]>([]);

  const handleOnLanding = ({ action, content }: SocketData) => {
    switch (action) {
      case LandingSocketEvent.INIT:
        const { project, myInfo, member, sprint, board, link } =
          content as LandingDTO;
        setProject(project);
        setMyInfo(myInfo);
        setMember(member);
        setSprint(sprint);
        setBoard(board);
        setLink(link);
        break;
    }
  };

  useEffect(() => {
    socket.emit("joinPage", "landing");
    socket.on("landing", handleOnLanding);
  }, [socket]);

  return { project, myInfo, member, sprint, board, link };
};

export default useLandingSocket;
