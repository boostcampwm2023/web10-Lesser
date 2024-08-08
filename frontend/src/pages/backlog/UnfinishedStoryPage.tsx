import { DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { LexoRank } from "lexorank";
import StoryCreateButton from "../../components/backlog/StoryCreateButton";
import StoryCreateForm from "../../components/backlog/StoryCreateForm";
import StoryBlock from "../../components/backlog/StoryBlock";
import useShowDetail from "../../hooks/pages/backlog/useShowDetail";
import useStoryEmitEvent from "../../hooks/pages/backlog/useStoryEmitEvent";
import changeEpicListToStoryList from "../../utils/changeEpicListToStoryList";
import getDragElementIndex from "../../utils/getDragElementIndex";
import { BacklogSocketData } from "../../types/common/backlog";
import { BacklogDTO } from "../../types/DTO/backlogDTO";
import DragContainer from "../../components/backlog/DragContainer";

const UnfinishedStoryPage = () => {
  const { socket, backlog }: { socket: Socket; backlog: BacklogDTO } =
    useOutletContext();
  const { showDetail, handleShowDetail } = useShowDetail();
  const [storyElementIndex, setStoryElementIndex] = useState<number>();
  const storyComponentRefList = useRef<HTMLDivElement[]>([]);
  const draggingComponentIdRef = useRef<number>();
  const storyList = useMemo(
    () =>
      changeEpicListToStoryList(backlog.epicList)
        .sort((storyA, storyB) => {
          if (storyA.rankValue < storyB.rankValue) {
            return -1;
          }
          if (storyA.rankValue > storyB.rankValue) {
            return 1;
          }
          return 0;
        })
        .filter(({ status }) => status !== "완료"),
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
      draggingComponentIdRef.current,
      event.clientY
    );

    setStoryElementIndex(index);
  };

  const handleDragStart = (id: number) => {
    draggingComponentIdRef.current = id;
  };

  const handleDragEnd = (event: DragEvent) => {
    event.stopPropagation();
    const targetIndex = storyList.findIndex(
      ({ id }) => id === draggingComponentIdRef.current
    );
    let rankValue;

    if (storyElementIndex === targetIndex) {
      draggingComponentIdRef.current = undefined;
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
      id: draggingComponentIdRef.current as number,
      rankValue,
    });

    draggingComponentIdRef.current = undefined;
    setStoryElementIndex(undefined);
  };

  useEffect(() => {
    const handleDragEvent = ({
      domain,
      action,
      content,
    }: BacklogSocketData) => {
      if (
        domain === "story" &&
        action === "delete" &&
        content.id === draggingComponentIdRef.current
      ) {
        setStoryElementIndex(undefined);
      }
    };

    socket.on("backlog", handleDragEvent);

    return () => {
      socket.off("backlog", handleDragEvent);
    };
  }, []);

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
              <DragContainer
                index={index}
                setRef={setStoryComponentRef}
                onDragStart={() => handleDragStart(id)}
                onDragEnd={handleDragEnd}
                currentlyDraggedOver={index === storyElementIndex}
              >
                <StoryBlock
                  {...{ id, title, point, status, epic, progress, taskList }}
                  taskExist={taskList.length > 0}
                  epicList={epicCategoryList}
                  lastTaskRankValue={
                    taskList.length
                      ? taskList[taskList.length - 1].rankValue
                      : undefined
                  }
                />
              </DragContainer>
            );
          }
        )}
        <div
          ref={setStoryComponentRef(storyList.length)}
          className={`${
            storyElementIndex === storyList.length
              ? "w-[67.9rem] h-1 bg-blue-400"
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
