import { Socket } from "socket.io-client";
import { MemoColorType } from "../../../types/common/landing";

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

  return { memoSocketEvent };
};

export default useLandingEmitEvent;
