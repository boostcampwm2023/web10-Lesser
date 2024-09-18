import { Socket } from "socket.io-client";

const useSettingProjectInfoSocket = (socket: Socket) => {
  const emitProjectInfoUpdateEvent = (content: {
    title: string;
    subject: string;
  }) => {
    socket.emit("projectInfo", { action: "update", content });
  };

  return { emitProjectInfoUpdateEvent };
};

export default useSettingProjectInfoSocket;
