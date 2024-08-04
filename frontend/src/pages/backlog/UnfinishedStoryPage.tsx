import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { LexoRank } from "lexorank";
import { BacklogDTO } from "../../types/DTO/backlogDTO";
import StoryCreateButton from "../../components/backlog/StoryCreateButton";
import StoryCreateForm from "../../components/backlog/StoryCreateForm";
import { DragEvent, useMemo, useRef, useState } from "react";
import changeEpicListToStoryList from "../../utils/changeEpicListToStoryList";
import StoryBlock from "../../components/backlog/StoryBlock";
import TaskBlock from "../../components/backlog/TaskBlock";
import useShowDetail from "../../hooks/pages/backlog/useShowDetail";
import useStoryEmitEvent from "../../hooks/pages/backlog/useStoryEmitEvent";
import getDragElementIndex from "../../utils/getDragElementIndex";

const UnfinishedStoryPage = () => {
  const { socket, backlog }: { socket: Socket; backlog: BacklogDTO } =
    useOutletContext();
  const { showDetail, handleShowDetail } = useShowDetail();
  const [storyElementIndex, setStoryElementIndex] = useState<number>();
  const storyComponentRefList = useRef<HTMLDivElement[]>([]);
  const draggingComponentIndexRef = useRef<number>();
  const storyList = useMemo(
    () =>
      changeEpicListToStoryList(backlog.epicList).sort((storyA, storyB) => {
        if (storyA.rankValue < storyB.rankValue) {
          return -1;
        }
        if (storyA.rankValue > storyB.rankValue) {
          return 1;
        }
        return 0;
      }),
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
  const { emitStoryUpdateEvent } = useStoryEmitEvent(socket);

  const setStoryComponentRef = (index: number) => (element: HTMLDivElement) => {
    storyComponentRefList.current[index] = element;
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    const index = getDragElementIndex(
      storyComponentRefList.current,
      draggingComponentIndexRef.current,
      event.clientY
    );

    setStoryElementIndex(index);
  };

  const handleDragStart = (index: number) => {
    draggingComponentIndexRef.current = index;
  };

  const handleDragEnd = (event: DragEvent) => {
    event.stopPropagation();
    let rankValue;

    if (storyElementIndex === draggingComponentIndexRef.current) {
      draggingComponentIndexRef.current = undefined;
      setStoryElementIndex(undefined);
      return;
    }

    if (storyElementIndex === 0) {
      const firstStoryRank = storyList[0].rankValue;
      rankValue = LexoRank.parse(firstStoryRank).genPrev().toString();
    } else if (storyElementIndex === storyList.length) {
      const lastStoryRank = storyList[storyList.length - 1].rankValue;
      rankValue = LexoRank.parse(lastStoryRank).genNext().toString();
    } else {
      const prevStoryRank = LexoRank.parse(
        storyList[(storyElementIndex as number) - 1].rankValue
      );
      const nextStoryRank = LexoRank.parse(
        storyList[storyElementIndex as number].rankValue
      );
      rankValue = prevStoryRank.between(nextStoryRank).toString();
    }

    emitStoryUpdateEvent({
      id: storyList[draggingComponentIndexRef.current as number].id,
      rankValue,
    });

    draggingComponentIndexRef.current = undefined;
    setStoryElementIndex(undefined);
  };

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
                    index === storyElementIndex ? "w-full h-1 bg-blue-400" : ""
                  } absolute`}
                />
                <StoryBlock
                  {...{ id, title, point, status }}
                  epic={epic}
                  progress={progress}
                  taskExist={taskList.length > 0}
                  epicList={epicCategoryList}
                  lastTaskRankValue={
                    taskList.length
                      ? taskList[taskList.length - 1].rankValue
                      : undefined
                  }
                >
                  {...taskList.map((task) => <TaskBlock {...task} />)}
                </StoryBlock>
              </div>
            );
          }
        )}
        <div
          ref={setStoryComponentRef(storyList.length)}
          className={`${
            storyElementIndex === storyList.length
              ? "w-full h-1 bg-blue-400"
              : ""
          } absolute`}
        />
      </div>
      {showDetail ? (
        <StoryCreateForm
          epicList={epicCategoryList}
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
    </div>
  );
};

export default UnfinishedStoryPage;
