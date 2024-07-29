import { useOutletContext } from "react-router-dom";
import { BacklogDTO } from "../../types/DTO/backlogDTO";
import { useMemo } from "react";
import StoryBlock from "../../components/backlog/StoryBlock";
import changeEpicListToStoryList from "../../utils/changeEpicListToStoryList";
import TaskBlock from "../../components/backlog/TaskBlock";

const FinishedStoryPage = () => {
  const { backlog }: { backlog: BacklogDTO } = useOutletContext();
  const storyList = useMemo(
    () =>
      changeEpicListToStoryList(backlog.epicList).filter(
        ({ status }) => status === "완료"
      ),
    [backlog.epicList]
  );
  const epicCategoryList = useMemo(
    () => backlog.epicList.map(({ id, name, color }) => ({ id, name, color })),
    [backlog.epicList]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full border-b">
        {...storyList.map(({ id, epic, title, point, status, taskList }) => {
          const progress = taskList.length
            ? Math.round(
                (taskList.filter(({ status }) => status === "완료").length /
                  taskList.length) *
                  100
              )
            : 0;

          return (
            <StoryBlock
              {...{ id, title, point, status }}
              epic={epic}
              progress={progress}
              taskExist={taskList.length > 0}
              epicList={epicCategoryList}
            >
              {...taskList.map((task) => <TaskBlock {...task} />)}
            </StoryBlock>
          );
        })}
      </div>
    </div>
  );
};

export default FinishedStoryPage;
