import { Socket } from "socket.io-client";
import { TaskForm } from "../../../types/common/backlog";

const useTaskEmitEvent = (socket: Socket) => {
  const emitTaskCreateEvent = (content: TaskForm) => {
    socket.emit("task", { action: "create", content });
  };

  return { emitTaskCreateEvent };
};

export default useTaskEmitEvent;
