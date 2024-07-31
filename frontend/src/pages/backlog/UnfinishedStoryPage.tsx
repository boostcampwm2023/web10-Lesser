import { useOutletContext } from "react-router-dom";
import { BacklogDTO } from "../../types/DTO/backlogDTO";
import StoryCreateButton from "../../components/backlog/StoryCreateButton";
import StoryCreateForm from "../../components/backlog/StoryCreateForm";
import { DragEvent, useMemo, useRef, useState } from "react";
import changeEpicListToStoryList from "../../utils/changeEpicListToStoryList";
import StoryBlock from "../../components/backlog/StoryBlock";
import TaskBlock from "../../components/backlog/TaskBlock";
import useShowDetail from "../../hooks/pages/backlog/useShowDetail";

const UnfinishedStoryPage = () => {
  const { backlog }: { backlog: BacklogDTO } = useOutletContext();
  const { showDetail, handleShowDetail } = useShowDetail();
  const [beforeElementIndex, setBeforeElementIndex] = useState<number>();
  const storyComponentRefList = useRef<HTMLDivElement[]>([]);
  const draggingComponentIndexRef = useRef<number>();
  const storyList = useMemo(
    () => changeEpicListToStoryList(backlog.epicList),
    [backlog.epicList]
  );
  const epicCategoryList = useMemo(
    () => backlog.epicList.map(({ id, name, color }) => ({ id, name, color })),
    [backlog.epicList]
  );

  const setStoryComponentRef = (index: number) => (element: HTMLDivElement) => {
    storyComponentRefList.current[index] = element;
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    const index = getDragBeforeElement(event.clientY);
    setBeforeElementIndex(index);
  };

  const handleDragStart = (index: number) => {
    draggingComponentIndexRef.current = index;
  };

  const handleDragEnd = (event: DragEvent) => {
    event.stopPropagation();
    draggingComponentIndexRef.current = undefined;
    setBeforeElementIndex(undefined);
  };

  function getDragBeforeElement(y: number) {
    return storyComponentRefList.current.reduce(
      (closest, child, index) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, index };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        index: draggingComponentIndexRef.current,
      }
    ).index;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full border-b" onDragOver={handleDragOver}>
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
              <div
                className="relative"
                ref={setStoryComponentRef(index)}
                draggable={true}
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
              >
                <div
                  className={`${
                    index === beforeElementIndex ? "w-full h-1 bg-blue-400" : ""
                  } absolute`}
                />
                <StoryBlock
                  {...{ id, title, point, status }}
                  epic={epic}
                  progress={progress}
                  taskExist={taskList.length > 0}
                  epicList={epicCategoryList}
                >
                  {...taskList.map((task) => <TaskBlock {...task} />)}
                </StoryBlock>
              </div>
            );
          }
        )}
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
