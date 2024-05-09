import { LandingMemoDTO } from "../../../types/DTO/landingDTO";
import { MemoColorType } from "../../../types/common/landing";
import LandingTitleUI from "../common/LandingTitleUI";
import MemoBlock from "./MemoBlock";

interface LandingMemoListProps {
  memoList: LandingMemoDTO[];
  memoSocketEvent: {
    emitMemoCreateEvent: () => void;
    emitMemoDeleteEvent: (id: number) => void;
    emitMemoColorUpdateEvent: (id: number, color: MemoColorType) => void;
  };
}

const LandingMemoList = ({
  memoList,
  memoSocketEvent,
}: LandingMemoListProps) => {
  const { emitMemoCreateEvent, emitMemoDeleteEvent, emitMemoColorUpdateEvent } =
    memoSocketEvent;
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
