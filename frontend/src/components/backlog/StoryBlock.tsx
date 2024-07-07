import useShowDetail from "../../hooks/pages/backlog/useShowDetail";
import { BacklogStatusType } from "../../types/DTO/backlogDTO";
import BacklogStatusChip from "./BacklogStatusChip";
import CategoryChip from "./CategoryChip";
import TaskCreateButton from "./TaskCreateButton";
import ChevronDown from "../../assets/icons/chevron-down.svg?react";
import ChevronRight from "../../assets/icons/chevron-right.svg?react";
import TaskContainer from "./TaskContainer";
import TaskHeader from "./TaskHeader";

interface StoryBlockProps {
  epic: string;
  title: string;
  point: number | null;
  progress: number;
  status: BacklogStatusType;
  children: React.ReactNode;
  taskExist: boolean;
}

const StoryBlock = ({
  epic,
  title,
  point,
  progress,
  status,
  taskExist,
  children,
}: StoryBlockProps) => {
  const { showDetail, handleShowDetail } = useShowDetail();

  return (
    <>
      <div className="flex items-center py-1 border-t border-b">
        <div className="w-[5rem] mr-5">
          <CategoryChip content={epic} bgColor="green" />
        </div>
        <div className="flex items-center gap-1 w-[40.9rem] mr-4">
          <button
            className="flex items-center justify-center w-5 h-5 rounded-md hover:bg-dark-gray hover:bg-opacity-20"
            type="button"
            onClick={() => handleShowDetail(!showDetail)}
          >
            {showDetail ? (
              <ChevronDown
                width={16}
                height={16}
                fill={taskExist ? "black" : "#C5C5C5"}
              />
            ) : (
              <ChevronRight
                width={16}
                height={16}
                fill={taskExist ? "black" : "#C5C5C5"}
              />
            )}
          </button>
          <p>{title}</p>
        </div>
        <div className="w-[4rem] mr-[2.76rem] text-right">
          <p className="">{point} POINT</p>
        </div>
        <div className="w-[4rem] mr-[2.76rem] text-right">
          <span>{progress}%</span>
        </div>
        <div className="w-[6.25rem]">
          <BacklogStatusChip status={status} />
        </div>
      </div>
      {showDetail && (
        <TaskContainer>
          <TaskHeader />
          {children}
          <TaskCreateButton />
        </TaskContainer>
      )}
    </>
  );
};

export default StoryBlock;
