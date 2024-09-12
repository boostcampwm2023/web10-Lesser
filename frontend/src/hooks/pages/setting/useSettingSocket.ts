import { useEffect } from "react";
import { Socket } from "socket.io-client";

const useSettingSocket = (socket: Socket) => {
  useEffect(() => {
    socket.emit("joinLanding");
  }, []);
};

export default useSettingSocket;
