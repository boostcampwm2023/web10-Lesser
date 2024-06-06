import { Socket } from "socket.io-client";
import {
  LandingSocketData,
  LandingSocketDomain,
  LandingSocketMemberAction,
} from "../../../types/common/landing";
import { LandingDTO, LandingMemberDTO } from "../../../types/DTO/landingDTO";
import useMemberStore from "../../../stores/useMemberStore";
import { useEffect, useRef } from "react";
import { USER_STATUS_WORD } from "../../../constants/landing";

const useUpdateUserStatus = (
  socket: Socket,
  handleChangeStatus: (option: string) => void
) => {
  const {
    myInfo,
    memberList,
    updateMyInfo,
    updateMyStatus,
    updateMemberList,
    addMember,
  } = useMemberStore();
  const inviteLinkIdRef = useRef<string>("");

  const handleInitEvent = (content: LandingDTO) => {
    const { myInfo, member: memberList, inviteLinkId } = content;
    updateMyInfo(myInfo);
    updateMemberList(memberList);
    inviteLinkIdRef.current = inviteLinkId;
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
        if (content.id === myInfo.id) {
          updateMyStatus((content as LandingMemberDTO).status);
          handleChangeStatus(
            USER_STATUS_WORD[(content as LandingMemberDTO).status]
          );

          break;
        }

        updateMemberList(
          memberList.map((member) => {
            if (member.id === content.id) {
              return {
                ...member,
                status: (content as LandingMemberDTO).status,
              };
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
      case LandingSocketDomain.MEMBER:
        handleMemberEvent(action, content);
        break;
    }
  };

  const emitMemberStatusUpdate = (content: LandingMemberDTO) => {
    socket.emit("member", {
      action: "update",
      content,
    });
  };

  useEffect(() => {
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing", handleOnLanding);
    };
  }, [socket, myInfo, memberList]);

  return { myInfo, memberList, inviteLinkIdRef, emitMemberStatusUpdate };
};

export default useUpdateUserStatus;
