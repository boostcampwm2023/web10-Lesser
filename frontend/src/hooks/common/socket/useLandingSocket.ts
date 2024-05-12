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
import {
  LandingSocketData,
  LandingSocketDomain,
  LandingSocketMemoAction,
} from "../../../types/common/landing";

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

  const handleMemoEvent = (
    action: LandingSocketMemoAction,
    content: LandingMemoDTO
  ) => {
    switch (action) {
      case LandingSocketMemoAction.CREATE:
        setMemoList((memoList: LandingMemoDTO[]) => {
          return [content, ...memoList];
        });
        break;
      case LandingSocketMemoAction.DELETE:
        setMemoList((memoList: LandingMemoDTO[]) => {
          return memoList.filter(
            (memo: LandingMemoDTO) => memo.id !== content.id
          );
        });
        break;
      case LandingSocketMemoAction.COLOR_UPDATE:
        setMemoList((memoList: LandingMemoDTO[]) => {
          return memoList.map((memo: LandingMemoDTO) => {
            if (memo.id !== content.id) return memo;
            memo.color = content.color;
            return memo;
          });
        });
    }
  };

  const handleOnLanding = ({ domain, action, content }: LandingSocketData) => {
    switch (domain) {
      case LandingSocketDomain.INIT:
        handleInitEvent(content);
        break;
      case LandingSocketDomain.MEMO:
        handleMemoEvent(action, content);
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
    sprint,
    memoList,
    link,
    inviteLinkIdRef,
  };
};

export default useLandingSocket;
