import { useEffect } from "react";
import { Socket } from "socket.io-client";
import useMemberStore from "../../../stores/useMemberStore";
import emitMemberStatusUpdate from "../../../utils/emitMemberStatusUpdate";

const useUserLeaveProject = (socket: Socket) => {
  const myInfo = useMemberStore((state) => state.myInfo);
  const updateMemberList = useMemberStore((state) => state.updateMemberList);

  useEffect(
    () => () => {
      updateMemberList([]);
      emitMemberStatusUpdate(socket, {
        ...myInfo,
        status: "off",
      });
    },
    []
  );
};

export default useUserLeaveProject;
