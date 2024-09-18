import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { BASE_URL, ROUTER_URL } from "../../../constants/path";
import { getAccessToken } from "../../../apis/utils/authAPI";
import { SettingSocketData } from "../../../types/common/setting";

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
  const navigate = useNavigate();

  const handleProjectDeleted = ({ domain, action }: SettingSocketData) => {
    if (domain === "projectInfo" && action === "delete") {
      alert("프로젝트가 삭제되었습니다.");
      setTimeout(() => {
        navigate(ROUTER_URL.PROJECTS);
      }, 1000);
    }
  };

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
    socket.on("main", handleProjectDeleted);

    return () => {
      socket.disconnect();
      socket.off("connect", handleOnConnect);
      socket.off("disconnect", handleOnDisconnect);
      socket.off("main", handleProjectDeleted);
    };
  }, []);

  return { socket, connected };
};

export default useSocket;
