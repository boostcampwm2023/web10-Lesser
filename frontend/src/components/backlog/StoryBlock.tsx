import ChevronDown from "../../assets/icons/chevron-down.svg?react";
import { BacklogStatusType } from "../../types/DTO/backlogDTO";
import BacklogStatusChip from "./BacklogStatusChip";
import CategoryChip from "./CategoryChip";

interface StoryBlockProps {
  epic: string;
  title: string;
  point: number;
  progress: number;
  status: BacklogStatusType;
}

const StoryBlock = ({
  epic,
  title,
  point,
  progress,
  status,
}: StoryBlockProps) => (
  <div className="flex items-center gap-5 py-1 border-t border-b">
    <div className="w-[5rem]">
      <CategoryChip content={epic} bgColor="green" />
    </div>
    <div className="flex items-center gap-1 w-[38.75rem]">
      <button
        className="flex items-center justify-center w-5 h-5 rounded-md hover:bg-dark-gray hover:bg-opacity-20"
        type="button"
      >
        <ChevronDown width={16} height={16} fill="black" />
      </button>
      <p>{title}</p>
    </div>
    <div className="w-[4rem] text-right">
      <p className="">{point} POINT</p>
    </div>
    <div className="w-[4rem] text-right">
      <span>{progress}%</span>
    </div>
    <div className="w-[4rem]">
      <BacklogStatusChip status={status} />
    </div>
  </div>
);

export default StoryBlock;
