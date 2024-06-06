import { Socket } from "socket.io-client";
import { LandingDTO, LandingMemoDTO } from "../../../types/DTO/landingDTO";
import {
  LandingSocketData,
  LandingSocketDomain,
  LandingSocketMemoAction,
  MemoColorType,
} from "../../../types/common/landing";
import LandingTitleUI from "../common/LandingTitleUI";
import MemoBlock from "./MemoBlock";
import { useOutletContext } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

const LandingMemoList = () => {
  const { socket }: { socket: Socket } = useOutletContext();
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

  return (
    <div className="w-full rounded-lg shadow-box bg-gradient-to-tr from-dark-green-linear-from to-dark-green-linear-to">
      <div className="py-6 ps-6 pe-3 w-[32rem]">
        <LandingTitleUI
          title={"프로젝트 메모"}
          handleClick={emitMemoCreateEvent}
        />
        <div className="mt-6 flex flex-wrap w-full h-[11rem] gap-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-dark-green scrollbar-track-transparent scrollbar-thumb-rounded-full">
          {memoList.map((memo: LandingMemoDTO) => {
            return (
              <MemoBlock
                {...{ ...memo, emitMemoColorUpdateEvent, emitMemoDeleteEvent }}
                key={memo.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingMemoList;
