import { Socket } from "socket.io-client";
import { MemoColorType } from "../../../types/common/landing";
import { LandingMemberDTO } from "../../../types/DTO/landingDTO";

const useLandingEmitEvent = (socket: Socket) => {
  const memoSocketEvent = {
    emitMemoCreateEvent: () => {
      socket.emit("memo", { action: "create", content: { color: "yellow" } });
    },
    emitMemoDeleteEvent: (id: number) => {
      socket.emit("memo", { action: "delete", content: { id } });
    },
    emitMemoColorUpdateEvent: (id: number, color: MemoColorType) => {
      socket.emit("memo", { action: "colorUpdate", content: { id, color } });
    },
  };

  const memberSocketEvent = {
    emitMemberStatusUpdate: (content: LandingMemberDTO) => {
      socket.emit("member", {
        action: "update",
        content,
      });
    },
  };

  return { memoSocketEvent, memberSocketEvent };
};

export default useLandingEmitEvent;
