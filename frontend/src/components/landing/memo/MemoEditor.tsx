import TrashBinIcon from "../../../assets/icons/trash-can.svg?react";
import { MemoColorType } from "../../../types/common/landing";
import MemoColorButton from "./MemoColorButton";

interface MemoEditorProps {
  id: number;
  color: MemoColorType;
  changeMemoColor: (color: MemoColorType) => void;
  emitMemoDeleteEvent: (id: number) => void;
  emitMemoColorUpdateEvent: (id: number, color: MemoColorType) => void;
}

const MemoEditor = ({
  id,
  color,
  changeMemoColor,
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
        active={color === "yellow"}
        color={"yellow"}
        changeMemoColor={changeMemoColor}
        emitMemoColorUpdateEvent={emitMemoColorUpdateEvent}
      />
      <MemoColorButton
        id={id}
        active={color === "blue"}
        color={"blue"}
        changeMemoColor={changeMemoColor}
        emitMemoColorUpdateEvent={emitMemoColorUpdateEvent}
      />
      <MemoColorButton
        id={id}
        active={color === "red"}
        color={"red"}
        changeMemoColor={changeMemoColor}
        emitMemoColorUpdateEvent={emitMemoColorUpdateEvent}
      />
      <MemoColorButton
        id={id}
        active={color === "gray"}
        color={"gray"}
        changeMemoColor={changeMemoColor}
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
