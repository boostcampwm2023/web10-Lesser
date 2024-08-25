import ChevronDown from "../../assets/icons/chevron-down.svg?react";
import ChevronRight from "../../assets/icons/chevron-right.svg?react";
import CategoryChip from "./CategoryChip";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import useDropdownState from "../../hooks/common/dropdown/useDropdownState";
import EpicDropdown from "./EpicDropdown";

interface EpicBlockProps {
  storyExist: boolean;
  epic: EpicCategoryDTO;
  showStoryList: boolean;
  onShowStoryList: () => void;
}

const EpicBlock = ({
  storyExist,
  epic,
  showStoryList,
  onShowStoryList,
}: EpicBlockProps) => {
  const {
    open: epicUpdating,
    handleOpen: handleEpicUpdateOpen,
    dropdownRef: epicRef,
  } = useDropdownState();

  const handleEpicColumnClick = () => {
    if (!epicUpdating) {
      handleEpicUpdateOpen();
    }
  };

  return (
    <>
      <div className="flex items-center justify-start pb-1 text-s">
        <button
          className="flex items-center justify-center w-5 h-5 rounded-md hover:bg-dark-gray hover:bg-opacity-20"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onShowStoryList();
          }}
        >
          {showStoryList ? (
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
        <div
          className="h-[2.25rem] hover:cursor-pointer"
          ref={epicRef}
          onClick={handleEpicColumnClick}
        >
          <CategoryChip content={epic.name} bgColor={epic.color} />
          {epicUpdating && (
            <EpicDropdown
              selectedEpic={epic}
              epicList={[epic]}
              onEpicChange={() => {}}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EpicBlock;
