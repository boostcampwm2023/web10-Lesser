import { Socket } from "socket.io-client";
import { LandingDTO, LandingMemoDTO } from "../../../types/DTO/landingDTO";
import { useCallback, useEffect, useState } from "react";
import {
  LandingSocketData,
  LandingSocketDomain,
  LandingSocketMemoAction,
  MemoColorType,
} from "../../../types/common/landing";

const useLandingMemoSocket = (socket: Socket) => {
  const [memoList, setMemoList] = useState<LandingMemoDTO[]>([]);
  const handleInitEvent = (content: LandingDTO) => {
    const { memoList } = content as LandingDTO;
    setMemoList(memoList);
  };

  const handleMemoEvent = (
    action: LandingSocketMemoAction,
    content: LandingMemoDTO
  ) => {
    switch (action) {
      case LandingSocketMemoAction.CREATE:
        setMemoList((memoList: LandingMemoDTO[]) => {
          return [content, ...memoList];
        });
        break;
      case LandingSocketMemoAction.DELETE:
        setMemoList((memoList: LandingMemoDTO[]) => {
          return memoList.filter(
            (memo: LandingMemoDTO) => memo.id !== content.id
          );
        });
        break;
      case LandingSocketMemoAction.COLOR_UPDATE:
        setMemoList((memoList: LandingMemoDTO[]) => {
          return memoList.map((memo: LandingMemoDTO) => {
            if (memo.id !== content.id) return memo;
            return { ...memo, color: content.color };
          });
        });
    }
  };
  const handleOnMemoLanding = ({
    domain,
    action,
    content,
  }: LandingSocketData) => {
    switch (domain) {
      case LandingSocketDomain.INIT:
        handleInitEvent(content);
        break;
      case LandingSocketDomain.MEMO:
        handleMemoEvent(action, content);
        break;
    }
  };
  const emitMemoCreateEvent = useCallback(() => {
    socket.emit("memo", { action: "create", content: { color: "yellow" } });
  }, [socket]);
  const emitMemoDeleteEvent = useCallback(
    (id: number) => {
      socket.emit("memo", { action: "delete", content: { id } });
    },
    [socket]
  );
  const emitMemoColorUpdateEvent = useCallback(
    (id: number, color: MemoColorType) => {
      socket.emit("memo", { action: "colorUpdate", content: { id, color } });
    },
    [socket]
  );

  useEffect(() => {
    socket.on("landing", handleOnMemoLanding);

    return () => {
      socket.off("landing");
    };
  });

  return {
    memoList,
    emitMemoCreateEvent,
    emitMemoDeleteEvent,
    emitMemoColorUpdateEvent,
  };
};

export default useLandingMemoSocket;
