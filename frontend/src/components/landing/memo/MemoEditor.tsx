import TrashBinIcon from "../../../assets/icons/trash-can.svg?react";
import { MemoColor } from "../../../types/common/landing";
import MemoColorButton from "./MemoColorButton";

const MemoEditor = () => {
  return (
    <div className="absolute w-32 h-fit bottom-3 right-3 z-10 rounded-full flex justify-between items-center duration-100">
      <MemoColorButton active={true} color={MemoColor.yellow} />
      <MemoColorButton active={false} color={MemoColor.blue} />
      <MemoColorButton active={false} color={MemoColor.red} />
      <MemoColorButton active={false} color={MemoColor.gray} />
      <button className="w-5 h-5 rounded-full border-white border bg-error-red flex justify-center items-center hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out">
        <TrashBinIcon width={12} height={12} color="#FFFFFF" />
      </button>
    </div>
  );
};

export default MemoEditor;
