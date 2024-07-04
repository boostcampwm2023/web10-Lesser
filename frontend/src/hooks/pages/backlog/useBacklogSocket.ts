import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { BacklogDTO, EpicDTO } from "../../../types/DTO/backlogDTO";
import {
  BacklogSocketData,
  BacklogSocketDomain,
  BacklogSocketEpicAction,
} from "../../../types/common/backlog";

const useBacklogSocket = (socket: Socket) => {
  const [backlog, setBacklog] = useState<BacklogDTO>({ epicList: [] });

  const handleInitEvent = (content: { backlog: BacklogDTO }) => {
    if (!Object.keys(content).length) {
      return;
    }
    setBacklog(content.backlog);
  };

  const handleEpicEvent = (
    action: BacklogSocketEpicAction,
    content: EpicDTO
  ) => {
    switch (action) {
      case BacklogSocketEpicAction.CREATE:
        const newEpic = { ...content, storyList: [] };
        setBacklog((prevBacklog) => ({
          epicList: [...prevBacklog.epicList, newEpic],
        }));
        break;
      case BacklogSocketEpicAction.DELETE:
        setBacklog((prevBacklog) => ({
          epicList: prevBacklog.epicList.filter(({ id }) => id !== content.id),
        }));
        break;
      case BacklogSocketEpicAction.UPDATE:
        setBacklog((prevBacklog) => ({
          epicList: prevBacklog.epicList.map((epic) => {
            if (epic.id === content.id) {
              return { ...epic, ...content };
            }
            return epic;
          }),
        }));
        break;
    }
  };

  const handleOnBacklog = ({ domain, action, content }: BacklogSocketData) => {
    switch (domain) {
      case BacklogSocketDomain.BACKLOG:
        handleInitEvent(content);
        break;
      case BacklogSocketDomain.EPIC:
        handleEpicEvent(action, content);
        break;
    }
  };

  useEffect(() => {
    socket.emit("joinBacklog");
    socket.on("backlog", handleOnBacklog);

    return () => {
      socket.off("backlog", handleOnBacklog);
    };
  }, []);

  return { backlog };
};

export default useBacklogSocket;
