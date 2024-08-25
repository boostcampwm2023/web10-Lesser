import { Socket } from "socket.io-client";
import { BacklogCategoryColor } from "../../../types/common/backlog";

const useEpicEmitEvent = (socket: Socket) => {
  const emitEpicCreateEvent = (content: {
    name: string;
    color: BacklogCategoryColor;
    rankValue: string;
  }) => {
    socket.emit("epic", { action: "create", content });
  };

  const emitEpicDeleteEvent = (content: { id: number }) => {
    socket.emit("epic", { action: "delete", content });
  };

  const emitEpicUpdateEvent = (content: {
    id: number;
    name?: string;
    color?: BacklogCategoryColor;
    rankValue?: string;
  }) => {
    socket.emit("epic", { action: "update", content });
  };

  return {
    emitEpicCreateEvent,
    emitEpicDeleteEvent,
    emitEpicUpdateEvent,
  };
};

export default useEpicEmitEvent;
