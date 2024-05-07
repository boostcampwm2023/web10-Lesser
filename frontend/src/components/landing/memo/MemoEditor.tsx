import TrashBinIcon from "../../../assets/icons/trash-can.svg?react";
import { MemoColorType } from "../../../types/common/landing";
import MemoColorButton from "./MemoColorButton";

interface MemoEditorProps {
  color: MemoColorType;
  changeMemoColor: (color: MemoColorType) => void;
}

const MemoEditor = ({ color, changeMemoColor }: MemoEditorProps) => {
  return (
    <div className="w-32 h-fit rounded-full flex justify-between items-center duration-100">
      <MemoColorButton
        active={color === "yellow"}
        color={"yellow"}
        changeMemoColor={changeMemoColor}
      />
      <MemoColorButton
        active={color === "blue"}
        color={"blue"}
        changeMemoColor={changeMemoColor}
      />
      <MemoColorButton
        active={color === "red"}
        color={"red"}
        changeMemoColor={changeMemoColor}
      />
      <MemoColorButton
        active={color === "gray"}
        color={"gray"}
        changeMemoColor={changeMemoColor}
      />
      <button className="w-5 h-5 rounded-full border-white border bg-error-red flex justify-center items-center hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out">
        <TrashBinIcon width={12} height={12} color="#FFFFFF" />
      </button>
    </div>
  );
};

export default MemoEditor;
