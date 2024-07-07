import { Outlet, useOutletContext } from "react-router-dom";
import BacklogHeader from "../../components/backlog/BacklogHeader";
import useBacklogSocket from "../../hooks/pages/backlog/useBacklogSocket";
import { Socket } from "socket.io-client";

const BacklogPage = () => {
  const { socket }: { socket: Socket } = useOutletContext();
  const { backlog } = useBacklogSocket(socket);

  return (
    <div className="w-full h-full">
      <BacklogHeader />
      <Outlet context={{ socket, backlog }} />
    </div>
  );
};

export default BacklogPage;
