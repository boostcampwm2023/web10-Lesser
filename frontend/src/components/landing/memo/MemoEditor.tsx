import TrashBinIcon from "../../../assets/icons/trash-can.svg?react";
import { MEMO_COLOR } from "../../../constants/landing";
import { MemoColorType } from "../../../types/common/landing";
import MemoColorButton from "./MemoColorButton";

interface MemoEditorProps {
  id: number;
  color: MemoColorType;
  emitMemoDeleteEvent: (id: number) => void;
  emitMemoColorUpdateEvent: (id: number, color: MemoColorType) => void;
}

const MemoEditor = ({
  id,
  color,
  emitMemoDeleteEvent,
  emitMemoColorUpdateEvent,
}: MemoEditorProps) => {
  const handleClickDeleteButton = () => {
    emitMemoDeleteEvent(id);
  };

  return (
    <div className="w-32 h-fit rounded-full flex justify-between items-center duration-100">
      <MemoColorButton
        id={id}
        active={color === MEMO_COLOR.YELLOW}
        color={MEMO_COLOR.YELLOW}
        emitMemoColorUpdateEvent={emitMemoColorUpdateEvent}
      />
      <MemoColorButton
        id={id}
        active={color === MEMO_COLOR.BLUE}
        color={MEMO_COLOR.BLUE}
        emitMemoColorUpdateEvent={emitMemoColorUpdateEvent}
      />
      <MemoColorButton
        id={id}
        active={color === MEMO_COLOR.RED}
        color={"red"}
        emitMemoColorUpdateEvent={emitMemoColorUpdateEvent}
      />
      <MemoColorButton
        id={id}
        active={color === MEMO_COLOR.GRAY}
        color={MEMO_COLOR.GRAY}
        emitMemoColorUpdateEvent={emitMemoColorUpdateEvent}
      />
      <button
        onClick={handleClickDeleteButton}
        className="w-5 h-5 rounded-full border-white border bg-error-red flex justify-center items-center hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out"
      >
        <TrashBinIcon width={12} height={12} color="#FFFFFF" />
      </button>
    </div>
  );
};

export default MemoEditor;
