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
  LandingSocketMemberAction,
  LandingSocketMemoAction,
} from "../../../types/common/landing";
import useMemberStore from "../../../stores/useMemberStore";

const useLandingSocket = (socket: Socket) => {
  const [project, setProject] = useState<LandingProjectDTO>(
    DEFAULT_VALUE.PROJECT
  );
  const [sprint, setSprint] = useState<LandingSprintDTO | null>(null);
  const [memoList, setMemoList] = useState<LandingMemoDTO[]>([]);
  const [link, setLink] = useState<LandingLinkDTO[]>([]);
  const { myInfo, memberList, updateMyInfo, updateMemberList, addMember } =
    useMemberStore();
  const inviteLinkIdRef = useRef<string>("");

  const handleInitEvent = (content: LandingDTO) => {
    const { project, myInfo, member, sprint, memoList, link, inviteLinkId } =
      content as LandingDTO;
    setProject(project);
    updateMyInfo(myInfo);
    updateMemberList(member);
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
        setMemoList((memoList: LandingMemoDTO[]) => [content, ...memoList]);
        break;
      case LandingSocketMemoAction.DELETE:
        setMemoList((memoList: LandingMemoDTO[]) =>
          memoList.filter((memo: LandingMemoDTO) => memo.id !== content.id)
        );
        break;
      case LandingSocketMemoAction.COLOR_UPDATE:
        setMemoList((memoList: LandingMemoDTO[]) =>
          memoList.map((memo: LandingMemoDTO) => {
            if (memo.id !== content.id) {
              return memo;
            }
            memo.color = content.color;
            return memo;
          })
        );
    }
  };

  const handleMemberEvent = (
    action: LandingSocketMemberAction,
    content: LandingMemberDTO | { id: number }
  ) => {
    switch (action) {
      case LandingSocketMemberAction.CREATE: {
        addMember(content as LandingMemberDTO);

        break;
      }
      case LandingSocketMemberAction.UPDATE: {
        updateMemberList(
          memberList.map((member) => {
            if (member.id === content.id) {
              member.status = (content as LandingMemberDTO).status;
            }

            return member;
          })
        );

        break;
      }
      case LandingSocketMemberAction.DELETE: {
        updateMemberList(memberList.filter(({ id }) => id !== content.id));

        break;
      }
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
      case LandingSocketDomain.MEMBER:
        handleMemberEvent(action, content);
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
    memberList,
    sprint,
    memoList,
    link,
    inviteLinkIdRef,
  };
};

export default useLandingSocket;
