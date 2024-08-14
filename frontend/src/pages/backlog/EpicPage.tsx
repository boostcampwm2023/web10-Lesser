import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BacklogDTO } from "../../types/DTO/backlogDTO";
import StoryCreateButton from "../../components/backlog/StoryCreateButton";
import StoryCreateForm from "../../components/backlog/StoryCreateForm";
import StoryBlock from "../../components/backlog/StoryBlock";
import TaskBlock from "../../components/backlog/TaskBlock";
import EpicBlock from "../../components/backlog/EpicBlock";
import TaskContainer from "../../components/backlog/TaskContainer";
import TaskHeader from "../../components/backlog/TaskHeader";

const EpicPage = () => {
  const { backlog }: { backlog: BacklogDTO } = useOutletContext();
  const [showTaskList, setShowTaskList] = useState(
    backlog.epicList.map(({ storyList }) => storyList.map(() => false))
  );
  const [showStory, setShowStory] = useState(
    Array.from(new Array(backlog.epicList.length), () => ({
      showStoryList: false,
      showStoryForm: false,
    }))
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

  const handleShowTaskList = (epicIndex: number, storyIndex: number) => {
    const newShowTaskList = showTaskList.map((innerArray1) => [...innerArray1]);
    newShowTaskList[epicIndex][storyIndex] =
      !newShowTaskList[epicIndex][storyIndex];

    setShowTaskList(newShowTaskList);
  };

  const handleShowStoryList = (epicIndex: number) => {
    const newShowStory = [...showStory];
    const currentShowStory = newShowStory[epicIndex];

    if (currentShowStory.showStoryList) {
      newShowStory[epicIndex] = { showStoryList: false, showStoryForm: false };
    } else {
      newShowStory[epicIndex] = {
        ...newShowStory[epicIndex],
        showStoryList: true,
      };
    }

    setShowStory(newShowStory);
  };

  const handleShowStoryForm = (epicIndex: number) => {
    const newShowStory = [...showStory];
    newShowStory[epicIndex] = {
      ...newShowStory[epicIndex],
      showStoryForm: !newShowStory[epicIndex].showStoryForm,
    };

    setShowStory(newShowStory);
  };

  return (
    <div className="flex flex-col gap-4 pb-3">
      {...backlog.epicList.map(
        ({ id: epicId, name, color, rankValue, storyList }, epicIndex) => (
          <div className="py-2 border-t border-b">
            <EpicBlock
              storyExist={storyList.length > 0}
              epic={{ id: epicId, name, color, rankValue }}
              showStoryList={showStory[epicIndex].showStoryList}
              onShowStoryList={() => handleShowStoryList(epicIndex)}
            />
            {showStory[epicIndex].showStoryList && (
              <div className="w-[65rem] ml-auto">
                {...storyList.map(
                  ({ id, title, point, status, taskList }, storyIndex) => {
                    const progress = taskList.length
                      ? Math.round(
                          (taskList.filter(({ status }) => status === "완료")
                            .length /
                            taskList.length) *
                            100
                        )
                      : 0;

                    return (
                      <>
                        <StoryBlock
                          {...{ id, title, point, status }}
                          epic={{ id: epicId, name, color, rankValue }}
                          progress={progress}
                          taskExist={taskList.length > 0}
                          showTaskList={showTaskList[epicIndex][storyIndex]}
                          onShowTaskList={() =>
                            handleShowTaskList(epicIndex, storyIndex)
                          }
                        />
                        {showTaskList[epicIndex][storyIndex] && (
                          <TaskContainer>
                            <TaskHeader />
                            {...taskList.map((task) => <TaskBlock {...task} />)}
                          </TaskContainer>
                        )}
                      </>
                    );
                  }
                )}
                {showStory[epicIndex].showStoryForm ? (
                  <StoryCreateForm
                    epicList={epicCategoryList}
                    epic={{ id: epicId, name, color, rankValue }}
                    onCloseClick={() => handleShowStoryForm(epicIndex)}
                    lastStoryRankValue={
                      storyList.length
                        ? storyList[storyList.length - 1].rankValue
                        : undefined
                    }
                  />
                ) : (
                  <StoryCreateButton
                    onClick={() => handleShowStoryForm(epicIndex)}
                  />
                )}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default EpicPage;
