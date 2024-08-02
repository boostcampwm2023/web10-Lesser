import { Socket } from "socket.io-client";
import { TaskForm } from "../../../types/common/backlog";
import { BacklogStatusType } from "../../../types/DTO/backlogDTO";

const useTaskEmitEvent = (socket: Socket) => {
  const emitTaskCreateEvent = (content: TaskForm) => {
    socket.emit("task", { action: "create", content });
  };

  const emitTaskUpdateEvent = (content: {
    id: number;
    title?: string;
    expectedTime?: number | null;
    actualTime?: number | null;
    assignedMemberId?: number;
    storyId?: number;
    status?: BacklogStatusType;
    rankValue?: string;
  }) => {
    socket.emit("task", { action: "update", content });
  };

  const emitTaskDeleteEvent = (content: { id: number }) => {
    socket.emit("task", { action: "delete", content });
  };

  return { emitTaskCreateEvent, emitTaskUpdateEvent, emitTaskDeleteEvent };
};

export default useTaskEmitEvent;
