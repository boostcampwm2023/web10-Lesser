import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { BacklogDTO } from "../../types/DTO/backlogDTO";
import StoryCreateButton from "../../components/backlog/StoryCreateButton";
import StoryCreateForm from "../../components/backlog/StoryCreateForm";
import StoryBlock from "../../components/backlog/StoryBlock";
import TaskBlock from "../../components/backlog/TaskBlock";
import useShowDetail from "../../hooks/pages/backlog/useShowDetail";
import EpicBlock from "../../components/backlog/EpicBlock";

const EpicPage = () => {
  const { backlog }: { backlog: BacklogDTO } = useOutletContext();
  const { showDetail, handleShowDetail } = useShowDetail();
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

  return (
    <div className="flex flex-col gap-4">
      {...backlog.epicList.map(
        ({ id: epicId, name, color, rankValue, storyList }) => (
          <EpicBlock
            storyExist={storyList.length > 1}
            epic={{ id: epicId, name, color, rankValue }}
          >
            {...storyList.map(({ id, title, point, status, taskList }) => {
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
                  epic={{ id: epicId, name, color, rankValue }}
                  progress={progress}
                  taskExist={taskList.length > 0}
                  lastTaskRankValue={
                    taskList.length
                      ? taskList[taskList.length - 1].rankValue
                      : undefined
                  }
                >
                  {...taskList.map((task) => <TaskBlock {...task} />)}
                </StoryBlock>
              );
            })}
            {showDetail ? (
              <StoryCreateForm
                epicList={epicCategoryList}
                epic={{ id: epicId, name, color, rankValue }}
                onCloseClick={() => handleShowDetail(false)}
                lastStoryRankValue={
                  storyList.length
                    ? storyList[storyList.length - 1].rankValue
                    : undefined
                }
              />
            ) : (
              <StoryCreateButton onClick={() => handleShowDetail(true)} />
            )}
          </EpicBlock>
        )
      )}
    </div>
  );
};

export default EpicPage;
