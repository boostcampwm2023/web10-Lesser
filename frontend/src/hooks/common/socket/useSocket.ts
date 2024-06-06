import { io } from "socket.io-client";
import { BASE_URL } from "../../../constants/path";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../../apis/utils/authAPI";

const useSocket = (projectId: string) => {
  const WS_URL = `${BASE_URL}/project-${projectId}`;
  const [socket] = useState(
    io(WS_URL, {
      path: `/api/socket.io`,
      auth: {
        accessToken: getAccessToken(),
      },
      autoConnect: false,
    })
  );
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnConnect = () => {
      setConnected(true);
    };
    const handleOnDisconnect = () => {
      setConnected(false);
    };

    socket.connect();
    socket.on("connect", handleOnConnect);
    socket.on("disconnect", handleOnDisconnect);

    return () => {
      socket.disconnect();
      socket.off("connect", handleOnConnect);
      socket.off("disconnect", handleOnDisconnect);
    };
  }, []);

  return { socket, connected };
};

export default useSocket;
