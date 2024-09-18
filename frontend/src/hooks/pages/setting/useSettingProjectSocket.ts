import { Socket } from "socket.io-client";

const useSettingProjectSocket = (socket: Socket) => {
  const emitProjectDeleteEvent = () => {
    socket.emit("projectInfo", { action: "delete", content: {} });
  };

  return { emitProjectDeleteEvent };
};

export default useSettingProjectSocket;
