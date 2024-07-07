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
    []
  );

  return (
    <div>
      {...storyList.map(({ epic, title, point, status, taskList }) => (
        <StoryBlock {...{ title, point, status }} epic={epic.name} progress={2}>
          {...taskList.map((task) => <TaskBlock {...task} />)}
        </StoryBlock>
      ))}
      {showDetail ? (
        <StoryCreateForm onCloseClick={() => handleShowDetail(false)} />
      ) : (
        <StoryCreateButton onClick={() => handleShowDetail(true)} />
      )}
    </div>
  );
};

export default UnfinishedStoryPage;
