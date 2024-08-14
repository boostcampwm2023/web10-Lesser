import { useOutletContext } from "react-router-dom";
import { BacklogDTO } from "../../types/DTO/backlogDTO";
import { useMemo, useState } from "react";
import StoryBlock from "../../components/backlog/StoryBlock";
import changeEpicListToStoryList from "../../utils/changeEpicListToStoryList";
import TaskBlock from "../../components/backlog/TaskBlock";
import TaskContainer from "../../components/backlog/TaskContainer";
import TaskHeader from "../../components/backlog/TaskHeader";

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
    () =>
      backlog.epicList.map(({ id, name, color, rankValue }) => ({
        id,
        name,
        color,
        rankValue,
      })),
    [backlog.epicList]
  );

  const [showTaskList, setShowTaskList] = useState(
    new Array(storyList.length).fill(false)
  );

  const handleShowTaskList = (index: number) => {
    const newShowTaskList = [...showTaskList];
    newShowTaskList[index] = !newShowTaskList[index];
    setShowTaskList(newShowTaskList);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full border-b">
        {...storyList.map(
          ({ id, epic, title, point, status, taskList }, index) => {
            const progress = taskList.length
              ? Math.round(
                  (taskList.filter(({ status }) => status === "완료").length /
                    taskList.length) *
                    100
                )
              : 0;

            return (
              <>
                <StoryBlock
                  {...{ id, title, point, status }}
                  epic={epic}
                  progress={progress}
                  taskExist={taskList.length > 0}
                  epicList={epicCategoryList}
                  showTaskList={showTaskList[index]}
                  onShowTaskList={() => handleShowTaskList(index)}
                />
                {showTaskList[index] && (
                  <TaskContainer>
                    <TaskHeader />
                    {...taskList.map((task) => <TaskBlock {...task} />)}
                  </TaskContainer>
                )}
              </>
            );
          }
        )}
      </div>
    </div>
  );
};

export default FinishedStoryPage;
