import useShowDetail from "../../hooks/pages/backlog/useShowDetail";
import ChevronDown from "../../assets/icons/chevron-down.svg?react";
import ChevronRight from "../../assets/icons/chevron-right.svg?react";
import CategoryChip from "./CategoryChip";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";

interface EpicBlockProps {
  storyExist: boolean;
  epic: EpicCategoryDTO;
  children: React.ReactNode;
}

const EpicBlock = ({ storyExist, epic, children }: EpicBlockProps) => {
  const { showDetail, handleShowDetail } = useShowDetail();

  return (
    <>
      <div className="flex items-center justify-start py-1 border-t border-b text-s">
        <button
          className="flex items-center justify-center w-5 h-5 rounded-md hover:bg-dark-gray hover:bg-opacity-20"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleShowDetail(!showDetail);
          }}
        >
          {showDetail ? (
            <ChevronDown
              width={16}
              height={16}
              fill={storyExist ? "black" : "#C5C5C5"}
            />
          ) : (
            <ChevronRight
              width={16}
              height={16}
              fill={storyExist ? "black" : "#C5C5C5"}
            />
          )}
        </button>
        <div className="h-[2.25rem]">
          <CategoryChip content={epic.name} bgColor={epic.color} />
        </div>
      </div>
      {showDetail && <div className="w-[65rem] ml-auto">{children}</div>}
    </>
  );
};

export default EpicBlock;
