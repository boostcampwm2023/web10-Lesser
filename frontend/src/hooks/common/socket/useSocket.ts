import { io } from "socket.io-client";
import { BASE_URL } from "../../../constants/path";
import { createContext, useEffect, useState } from "react";
import { getAccessToken } from "../../../apis/utils/authAPI";

const useSocket = (projectId: string) => {
  const WS_URL = `${BASE_URL}/project-${projectId}`;
  const socket = io(WS_URL, {
    path: `/api/socket.io`,
    auth: {
      accessToken: getAccessToken(),
    },
  });
  const [connected, setConnected] = useState<boolean>(false);

  const SocketContext = createContext(socket);

  useEffect(() => {
    const handleOnConnect = () => {
      setConnected(true);
    };
    const handleOnDisconnect = () => {
      setConnected(false);
    };

    socket.on("connect", handleOnConnect);
    socket.on("disconnect", handleOnDisconnect);

    return () => {
      socket.off("connect", handleOnConnect);
      socket.off("disconnect", handleOnDisconnect);
    };
  }, []);

  return { socket, connected, SocketContext };
};

export default useSocket;
