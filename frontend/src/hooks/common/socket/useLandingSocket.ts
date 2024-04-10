import { Socket } from "socket.io-client";
import {
  LandingDTO,
  LandingLinkDTO,
  LandingMemberDTO,
  LandingMemoDTO,
  LandingProjectDTO,
  LandingSprintDTO,
} from "../../../types/DTO/landingDTO";
import { useEffect, useState } from "react";

type MemberEvent = "memberUpdate" | "memberCreate" | "memberDelete";

interface SocketData {
  action: "init" | MemberEvent;
  content: any;
}

enum LandingSocketType {
  Landing = "landing",
}

const useLandingSocket = (socket: Socket) => {
  const [project, setProject] = useState<LandingProjectDTO>();
  const [myInfo, setMyInfo] = useState<LandingMemberDTO>();
  const [member, setMember] = useState<LandingMemberDTO[]>([]);
  const [sprint, setSprint] = useState<LandingSprintDTO | null>();
  const [board, setBoard] = useState<LandingMemoDTO[]>([]);
  const [link, setLink] = useState<LandingLinkDTO[]>([]);

  const handleOnLanding = ({ action, content }: SocketData) => {
    switch (action) {
      case "init":
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
    socket.emit("joinPage", LandingSocketType.Landing);
    socket.on("landing", handleOnLanding);
  }, [socket]);

  return { project, myInfo, member, sprint, board, link };
};

export default useLandingSocket;
