import { Socket } from "socket.io-client";
import { StoryForm } from "../../../types/common/backlog";
import { BacklogStatusType } from "../../../types/DTO/backlogDTO";

const useStoryEmitEvent = (socket: Socket) => {
  const emitStoryCreateEvent = (content: StoryForm) => {
    socket.emit("story", { action: "create", content });
  };

  const emitStoryDeleteEvent = (content: { id: number }) => {
    socket.emit("story", { action: "delete", content });
  };

  const emitStoryUpdateEvent = (content: {
    id: number;
    title?: string;
    status?: BacklogStatusType;
    epicId?: number;
    point?: number;
    rankValue?: string;
  }) => {
    socket.emit("story", { action: "update", content });
  };

  return { emitStoryCreateEvent, emitStoryDeleteEvent, emitStoryUpdateEvent };
};

export default useStoryEmitEvent;
