import { useOutletContext } from "react-router-dom";
import { BacklogDTO } from "../../types/DTO/backlogDTO";
import StoryCreateButton from "../../components/backlog/StoryCreateButton";
import StoryCreateForm from "../../components/backlog/StoryCreateForm";
import { useMemo } from "react";
import changeEpicListToStoryList from "../../utils/changeEpicListToStoryList";
import StoryBlock from "../../components/backlog/StoryBlock";
import TaskBlock from "../../components/backlog/TaskBlock";
import useShowDetail from "../../hooks/pages/backlog/useShowDetail";

const UnfinishedStoryPage = () => {
  const { backlog }: { backlog: BacklogDTO } = useOutletContext();
  const { showDetail, handleShowDetail } = useShowDetail();
  const storyList = useMemo(
    () => changeEpicListToStoryList(backlog.epicList),
    [backlog.epicList]
  );
  const epicCategoryList = useMemo(
    () => backlog.epicList.map(({ id, name, color }) => ({ id, name, color })),
    [backlog.epicList]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full border-b">
        {...storyList.map(({ id, epic, title, point, status, taskList }) => (
          <StoryBlock
            {...{ id, title, point, status }}
            epic={epic}
            progress={2}
            taskExist={taskList.length > 0}
            epicList={epicCategoryList}
          >
            {...taskList.map((task) => <TaskBlock {...task} />)}
          </StoryBlock>
        ))}
      </div>
      {showDetail ? (
        <StoryCreateForm
          epicList={epicCategoryList}
          onCloseClick={() => handleShowDetail(false)}
        />
      ) : (
        <StoryCreateButton onClick={() => handleShowDetail(true)} />
      )}
    </div>
  );
};

export default UnfinishedStoryPage;
