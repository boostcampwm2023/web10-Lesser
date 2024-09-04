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
import { BacklogDTO, TaskDTO } from "../../types/DTO/backlogDTO";
import StoryDragContainer from "../../components/backlog/StoryDragContainer";
import TaskBlock from "../../components/backlog/TaskBlock";
import TaskDragContainer from "../../components/backlog/TaskDragContainer";
import TaskContainer from "../../components/backlog/TaskContainer";
import TaskHeader from "../../components/backlog/TaskHeader";
import TaskCreateBlock from "../../components/backlog/TaskCreateBlock";
import useTaskEmitEvent from "../../hooks/pages/backlog/useTaskEmitEvent";

const UnfinishedStoryPage = () => {
  const { socket, backlog }: { socket: Socket; backlog: BacklogDTO } =
    useOutletContext();
  const { showDetail, handleShowDetail } = useShowDetail();
  const [storyElementIndex, setStoryElementIndex] = useState<number>();
  const [taskElementIndex, setTaskElementIndex] = useState<{
    storyId?: number;
    taskIndex?: number;
  }>({
    storyId: undefined,
    taskIndex: undefined,
  });
  const [draggingStoryId, setDraggingStoryId] = useState<number>();
  const [draggingTaskId, setDraggingTaskId] = useState<number>();
  const storyComponentRefList = useRef<HTMLDivElement[]>([]);
  const taskComponentRefList = useRef<HTMLDivElement[][]>([]);
  const storyList = useMemo(
    () =>
      changeEpicListToStoryList(backlog.epicList)
        .filter(({ status }) => status !== "완료")
        .map((story) => {
          const newTaskList = story.taskList.slice();
          newTaskList.sort((taskA, taskB) => {
            if (taskA.rankValue < taskB.rankValue) {
              return -1;
            }
            if (taskA.rankValue > taskB.rankValue) {
              return 1;
            }
            return 0;
          });
          return { ...story, taskList: newTaskList };
        })
        .sort((storyA, storyB) => {
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
  const [showTaskList, setShowTaskList] = useState<{ [key: number]: boolean }>(
    {}
  );
  const { emitStoryUpdateEvent } = useStoryEmitEvent(socket);
  const { emitTaskUpdateEvent } = useTaskEmitEvent(socket);

  const handleShowTaskList = (id: number) => {
    const newShowTaskList = { ...showTaskList };
    newShowTaskList[id] = !newShowTaskList[id];
    setShowTaskList(newShowTaskList);
  };

  const setStoryComponentRef = (index: number) => (element: HTMLDivElement) => {
    if (element) {
      storyComponentRefList.current[index] = element;
    } else {
      storyComponentRefList.current = storyComponentRefList.current.filter(
        (ref) => ref !== null
      );
    }
  };

  const setTaskComponentRef =
    (storyIndex: number, taskIndex: number) => (element: HTMLDivElement) => {
      taskComponentRefList.current[storyIndex][taskIndex] = element;
    };

  const handleDragOver = (event: DragEvent) => {
    if (draggingTaskId) {
      return;
    }

    event.preventDefault();
    const index = getDragElementIndex(
      storyComponentRefList.current,
      storyList.findIndex(({ id }) => id === draggingStoryId),
      event.clientY
    );

    setStoryElementIndex(index);
  };

  const handleDragStart = (id: number) => {
    if (draggingTaskId) {
      return;
    }
    setDraggingStoryId(id);
  };

  const handleDragEnd = (event: DragEvent) => {
    if (draggingTaskId) {
      return;
    }

    event.stopPropagation();
    const targetIndex = storyList.findIndex(({ id }) => id === draggingStoryId);
    let rankValue;

    if (storyElementIndex === targetIndex) {
      setDraggingStoryId(undefined);
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
      id: draggingStoryId as number,
      rankValue,
    });

    setDraggingStoryId(undefined);
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
        content.id === draggingStoryId
      ) {
        setStoryElementIndex(undefined);
        return;
      }

      if (
        domain === "task" &&
        action === "delete" &&
        content.id === draggingTaskId
      ) {
        setTaskElementIndex({ storyId: undefined, taskIndex: undefined });
      }
    };

    socket.on("backlog", handleDragEvent);

    return () => {
      socket.off("backlog", handleDragEvent);
    };
  }, []);

  const handleTaskDragOver = (event: DragEvent, storyIndex: number) => {
    if (draggingStoryId) {
      return;
    }

    event.preventDefault();
    const mouseIndex = storyList[storyIndex].taskList.findIndex(
      ({ id }) => id === draggingTaskId
    );

    const index = getDragElementIndex(
      taskComponentRefList.current[storyIndex],
      mouseIndex,
      event.clientY
    );

    setTaskElementIndex({
      storyId: storyList[storyIndex].id,
      taskIndex: index,
    });
  };

  const handleTaskDragStart = (taskId: number) => {
    setDraggingTaskId(taskId);
  };

  const handleTaskDragEnd = () => {
    const { storyId, taskIndex } = taskElementIndex;
    const taskList = storyList.find(({ id }) => id === storyId)
      ?.taskList as TaskDTO[];
    const targetIndex = taskList?.findIndex(({ id }) => id === draggingTaskId);

    let rankValue;

    if (taskIndex === targetIndex) {
      setDraggingTaskId(undefined);
      setTaskElementIndex({ storyId: undefined, taskIndex: undefined });
      return;
    }

    if (taskIndex === 0 && !taskList.length) {
      rankValue = LexoRank.middle().toString();
    } else if (taskIndex === 0) {
      const firstTaskRank = taskList[0].rankValue;
      rankValue = LexoRank.parse(firstTaskRank).genPrev().toString();
    } else if (taskIndex === taskList.length) {
      const lastTaskRank = taskList[taskList.length - 1].rankValue;
      rankValue = LexoRank.parse(lastTaskRank).genNext().toString();
    } else {
      const prevTaskRank = LexoRank.parse(
        taskList[(taskIndex as number) - 1].rankValue
      );
      const nextTaskRank = LexoRank.parse(
        taskList[taskIndex as number].rankValue
      );
      rankValue = prevTaskRank.between(nextTaskRank).toString();
    }

    emitTaskUpdateEvent({
      id: draggingTaskId as number,
      storyId,
      rankValue,
    });

    setDraggingTaskId(undefined);
    setTaskElementIndex({ storyId: undefined, taskIndex: undefined });
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
            taskComponentRefList.current[index] = [];

            return (
              <div
                className="relative"
                onDragOver={(event) => handleTaskDragOver(event, index)}
              >
                <StoryDragContainer
                  index={index}
                  setRef={setStoryComponentRef}
                  onDragStart={() => handleDragStart(id)}
                  onDragEnd={handleDragEnd}
                  currentlyDraggedOver={index === storyElementIndex}
                >
                  <StoryBlock
                    key={id}
                    {...{ id, title, point, status, epic, progress }}
                    taskExist={taskList.length > 0}
                    epicList={epicCategoryList}
                    onShowTaskList={() => handleShowTaskList(id)}
                    showTaskList={showTaskList[id]}
                  />
                </StoryDragContainer>
                {showTaskList[id] && (
                  <TaskContainer>
                    <TaskHeader />
                    {...taskList.map((task, taskIndex) => (
                      <TaskDragContainer
                        storyIndex={index}
                        taskIndex={taskIndex}
                        setRef={setTaskComponentRef}
                        onDragEnd={handleTaskDragEnd}
                        onDragStart={() => handleTaskDragStart(task.id)}
                        currentlyDraggedOver={
                          id === taskElementIndex.storyId &&
                          taskIndex === taskElementIndex.taskIndex
                        }
                      >
                        <TaskBlock key={task.id} {...task} />
                      </TaskDragContainer>
                    ))}
                    <div
                      ref={setTaskComponentRef(index, taskList.length)}
                      className={`${
                        id === taskElementIndex.storyId &&
                        taskElementIndex.taskIndex === taskList.length
                          ? "w-[60.13rem] h-1 bg-blue-400"
                          : ""
                      } absolute`}
                    />
                    <TaskCreateBlock
                      storyId={id}
                      lastTaskRankValue={
                        taskList.length
                          ? taskList[taskList.length - 1].rankValue
                          : undefined
                      }
                    />
                  </TaskContainer>
                )}
              </div>
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
