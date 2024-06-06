import { useEffect } from "react";
import { Socket } from "socket.io-client";
import useMemberStore from "../../../stores/useMemberStore";
import useLandingEmitEvent from "../socket/useLandingEmitEvent";

const useUserLeaveProject = (socket: Socket) => {
  const myInfo = useMemberStore((state) => state.myInfo);
  const updateMemberList = useMemberStore((state) => state.updateMemberList);
  const { memberSocketEvent } = useLandingEmitEvent(socket);

  useEffect(
    () => () => {
      updateMemberList([]);
      memberSocketEvent.emitMemberStatusUpdate({
        ...myInfo,
        status: "off",
      });
    },
    []
  );
};

export default useUserLeaveProject;
