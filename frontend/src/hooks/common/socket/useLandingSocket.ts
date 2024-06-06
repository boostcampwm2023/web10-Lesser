import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import {
  LandingDTO,
  LandingLinkDTO,
  LandingMemoDTO,
  LandingProjectDTO,
  LandingSprintDTO,
} from "../../../types/DTO/landingDTO";
import { DEFAULT_VALUE } from "../../../constants/landing";
import {
  LandingSocketData,
  LandingSocketDomain,
  LandingSocketMemoAction,
} from "../../../types/common/landing";

const useLandingSocket = (socket: Socket) => {
  const [project, setProject] = useState<LandingProjectDTO>(
    DEFAULT_VALUE.PROJECT
  );
  const [sprint, setSprint] = useState<LandingSprintDTO | null>(null);
  const [memoList, setMemoList] = useState<LandingMemoDTO[]>([]);
  const [link, setLink] = useState<LandingLinkDTO[]>([]);

  const handleInitEvent = (content: LandingDTO) => {
    const { project, sprint, memoList, link } = content as LandingDTO;
    setProject(project);
    setSprint(sprint);
    setMemoList(memoList);
    setLink(link);
  };

  const handleMemoEvent = (
    action: LandingSocketMemoAction,
    content: LandingMemoDTO
  ) => {
    switch (action) {
      case LandingSocketMemoAction.CREATE:
        setMemoList((memoList: LandingMemoDTO[]) => [content, ...memoList]);
        break;
      case LandingSocketMemoAction.DELETE:
        setMemoList((memoList: LandingMemoDTO[]) =>
          memoList.filter((memo: LandingMemoDTO) => memo.id !== content.id)
        );
        break;
      case LandingSocketMemoAction.COLOR_UPDATE:
        setMemoList((memoList: LandingMemoDTO[]) =>
          memoList.map((memo: LandingMemoDTO) => {
            if (memo.id !== content.id) {
              return memo;
            }
            return { ...memo, color: content.color };
          })
        );
    }
  };

  const handleOnLanding = ({ domain, action, content }: LandingSocketData) => {
    switch (domain) {
      case LandingSocketDomain.INIT:
        handleInitEvent(content);
        break;
      case LandingSocketDomain.MEMO:
        handleMemoEvent(action, content);
        break;
    }
  };

  useEffect(() => {
    socket.emit("joinLanding");
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing");
    };
  }, [socket]);

  return {
    project,
    sprint,
    memoList,
    link,
  };
};

export default useLandingSocket;
