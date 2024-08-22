import { DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BacklogDTO, StoryDTO, TaskDTO } from "../../types/DTO/backlogDTO";
import StoryCreateButton from "../../components/backlog/StoryCreateButton";
import StoryCreateForm from "../../components/backlog/StoryCreateForm";
import StoryBlock from "../../components/backlog/StoryBlock";
import TaskBlock from "../../components/backlog/TaskBlock";
import EpicBlock from "../../components/backlog/EpicBlock";
import TaskContainer from "../../components/backlog/TaskContainer";
import TaskHeader from "../../components/backlog/TaskHeader";
import { Socket } from "socket.io-client";
import useStoryEmitEvent from "../../hooks/pages/backlog/useStoryEmitEvent";
import useTaskEmitEvent from "../../hooks/pages/backlog/useTaskEmitEvent";
import getDragElementIndex from "../../utils/getDragElementIndex";
import { LexoRank } from "lexorank";
import useEpicEmitEvent from "../../hooks/pages/backlog/useEpicEmitEvent";
import { BacklogSocketData } from "../../types/common/backlog";
import EpicPageStoryDragContainer from "../../components/backlog/EpicPageStoryDragContainer";
import EpicPageTaskDragContainer from "../../components/backlog/EpicPageTaskDragContainer";
import EpicDragContainer from "../../components/backlog/EpicDragContainer";
import TaskCreateBlock from "../../components/backlog/TaskCreateBlock";

const EpicPage = () => {
  const { socket, backlog }: { socket: Socket; backlog: BacklogDTO } =
    useOutletContext();
  const [showTaskList, setShowTaskList] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [showStory, setShowStory] = useState<{
    [key: number]: { showStoryList: boolean; showStoryForm: boolean };
  }>({});

  useEffect(() => {
    setShowStory((prevShowStory) => {
      if (!Object.keys(prevShowStory).length) {
        const newShowStory: {
          [key: number]: { showStoryList: boolean; showStoryForm: boolean };
        } = {};
        backlog.epicList.forEach(({ id }) => {
          newShowStory[id] = {
            showStoryList: false,
            showStoryForm: false,
          };
        });

        return newShowStory;
      }

      return prevShowStory;
    });
  }, [backlog]);

  const epicList = useMemo(
    () =>
      backlog.epicList
        .map((epic) => {
          const newStoryList = epic.storyList.map((story) => {
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
          });
          console.log(newStoryList);
          newStoryList.sort((storyA, storyB) => {
            if (storyA.rankValue < storyB.rankValue) {
              return -1;
            }
            if (storyA.rankValue > storyB.rankValue) {
              return 1;
            }
            return 0;
          });
          return { ...epic, storyList: newStoryList };
        })
        .sort((epicA, epicB) => {
          if (epicA.rankValue < epicB.rankValue) {
            return -1;
          }
          if (epicA.rankValue > epicB.rankValue) {
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

  const handleShowTaskList = (storyId: number) => {
    const newShowTaskList = { ...showTaskList };
    newShowTaskList[storyId] = !newShowTaskList[storyId];

    setShowTaskList(newShowTaskList);
  };

  const handleShowStoryList = (epicId: number) => {
    const newShowStory = { ...showStory };
    const currentShowStory = newShowStory[epicId];

    if (currentShowStory?.showStoryList) {
      newShowStory[epicId] = { showStoryList: false, showStoryForm: false };
    } else {
      newShowStory[epicId] = {
        ...currentShowStory,
        showStoryList: true,
      };
    }

    setShowStory(newShowStory);
  };

  const handleShowStoryForm = (epicId: number) => {
    const newShowStory = { ...showStory };

    newShowStory[epicId] = {
      ...newShowStory[epicId],
      showStoryForm: !newShowStory[epicId]?.showStoryForm,
    };

    setShowStory(newShowStory);
  };

  const [epicElementIndex, setEpicElementIndex] = useState<number>();
  const [storyElementIndex, setStoryElementIndex] = useState<{
    epicId?: number;
    storyIndex?: number;
  }>({
    epicId: undefined,
    storyIndex: undefined,
  });
  const [taskElementIndex, setTaskElementIndex] = useState<{
    epicId?: number;
    storyId?: number;
    taskIndex?: number;
  }>({
    epicId: undefined,
    storyId: undefined,
    taskIndex: undefined,
  });
  const [draggingEpicId, setDraggingEpicId] = useState<number>();
  const [draggingStoryId, setDraggingStoryId] = useState<number>();
  const [draggingTaskId, setDraggingTaskId] = useState<number>();
  const epicComponentRefList = useRef<HTMLDivElement[]>([]);
  const storyComponentRefList = useRef<HTMLDivElement[][]>([]);
  const taskComponentRefList = useRef<HTMLDivElement[][][]>([]);
  const { emitEpicUpdateEvent } = useEpicEmitEvent(socket);
  const { emitStoryUpdateEvent } = useStoryEmitEvent(socket);
  const { emitTaskUpdateEvent } = useTaskEmitEvent(socket);

  const setEpicComponentRef =
    (epicIndex: number) => (element: HTMLDivElement) => {
      epicComponentRefList.current[epicIndex] = element;
    };

  const setStoryComponentRef =
    (epicIndex: number, storyIndex: number) => (element: HTMLDivElement) => {
      storyComponentRefList.current[epicIndex][storyIndex] = element;
    };

  const setTaskComponentRef =
    (epicIndex: number, storyIndex: number, taskIndex: number) =>
    (element: HTMLDivElement) => {
      if (
        taskComponentRefList.current[epicIndex] &&
        taskComponentRefList.current[epicIndex][storyIndex]
      ) {
        taskComponentRefList.current[epicIndex][storyIndex][taskIndex] =
          element;
      }
    };

  const handleEpicDragOver = (event: DragEvent) => {
    if (draggingStoryId || draggingTaskId) {
      return;
    }
    event.preventDefault();

    const index = getDragElementIndex(
      epicComponentRefList.current,
      epicList.findIndex(({ id }) => id === draggingEpicId),
      event.clientY
    );

    setEpicElementIndex(index);
  };

  const handleEpicDragStart = (id: number) => {
    if (draggingTaskId || draggingStoryId) {
      return;
    }

    setDraggingEpicId(id);
  };

  const handleEpicDragEnd = (event: DragEvent) => {
    event.preventDefault();

    if (draggingTaskId || draggingStoryId) {
      return;
    }

    const targetIndex = epicList.findIndex(({ id }) => id === draggingEpicId);
    let rankValue;

    if (epicElementIndex === targetIndex) {
      setDraggingEpicId(undefined);
      setEpicElementIndex(undefined);
      return;
    }

    if (epicElementIndex === 0) {
      const firstEpicRank = epicList[0].rankValue;
      rankValue = LexoRank.parse(firstEpicRank).genPrev().toString();
    } else if (epicElementIndex === epicList.length) {
      const lastEpicRank = epicList[epicList.length - 1].rankValue;
      rankValue = LexoRank.parse(lastEpicRank).genNext().toString();
    } else {
      const prevEpicRank = LexoRank.parse(
        epicList[(epicElementIndex as number) - 1].rankValue
      );
      const nextEpicRank = LexoRank.parse(
        epicList[epicElementIndex as number].rankValue
      );
      rankValue = prevEpicRank.between(nextEpicRank).toString();
    }

    emitEpicUpdateEvent({
      id: draggingEpicId as number,
      rankValue,
    });

    setDraggingEpicId(undefined);
    setEpicElementIndex(undefined);
  };

  const handleStoryDragOver = (event: DragEvent, epicIndex: number) => {
    event.preventDefault();

    if (draggingTaskId || draggingEpicId) {
      return;
    }

    const mouseIndex = epicList[epicIndex].storyList.findIndex(
      ({ id }) => id === draggingStoryId
    );

    const index = getDragElementIndex(
      storyComponentRefList.current[epicIndex],
      mouseIndex,
      event.clientY
    );

    setStoryElementIndex({
      epicId: epicList[epicIndex].id,
      storyIndex: index,
    });
  };

  const handleStoryDragStart = (id: number) => {
    if (draggingTaskId || draggingEpicId) {
      return;
    }
    setDraggingStoryId(id);
  };

  const handleStoryDragEnd = (event: DragEvent) => {
    event.preventDefault();

    if (draggingEpicId || draggingTaskId) {
      return;
    }

    const { epicId, storyIndex } = storyElementIndex;
    const storyList = epicList.find(({ id }) => id === epicId)
      ?.storyList as StoryDTO[];
    const currentIndex = storyList?.findIndex(
      ({ id }) => id === draggingStoryId
    );

    let rankValue;

    if (storyIndex === currentIndex) {
      setDraggingStoryId(undefined);
      setStoryElementIndex({ epicId: undefined, storyIndex: undefined });
      return;
    }

    if (storyIndex === 0 && !storyList.length) {
      rankValue = LexoRank.middle().toString();
    } else if (storyIndex === 0) {
      const firstStoryRank = storyList[0].rankValue;
      rankValue = LexoRank.parse(firstStoryRank).genPrev().toString();
    } else if (storyIndex === storyList.length) {
      const lastStoryRank = storyList[storyList.length - 1].rankValue;
      rankValue = LexoRank.parse(lastStoryRank).genNext().toString();
    } else {
      const prevStoryRank = LexoRank.parse(
        storyList[(storyIndex as number) - 1].rankValue
      );
      const nextStoryRank = LexoRank.parse(
        storyList[storyIndex as number].rankValue
      );
      rankValue = prevStoryRank.between(nextStoryRank).toString();
      console.log("중간", rankValue);
    }

    emitStoryUpdateEvent({
      id: draggingStoryId as number,
      epicId,
      rankValue,
    });

    setDraggingStoryId(undefined);
    setStoryElementIndex({ epicId: undefined, storyIndex: undefined });
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
        setStoryElementIndex({ epicId: undefined, storyIndex: undefined });
      }
    };

    socket.on("backlog", handleDragEvent);

    return () => {
      socket.off("backlog", handleDragEvent);
    };
  }, []);

  const handleTaskDragOver = (
    event: DragEvent,
    epicIndex: number,
    storyIndex: number
  ) => {
    event.preventDefault();

    if (draggingStoryId || draggingEpicId) {
      return;
    }
    const { storyList } = epicList[epicIndex];

    const mouseIndex = storyList[storyIndex].taskList.findIndex(
      ({ id }) => id === draggingTaskId
    );

    const index = getDragElementIndex(
      taskComponentRefList.current[epicIndex][storyIndex],
      mouseIndex,
      event.clientY
    );

    setTaskElementIndex({
      epicId: epicList[epicIndex].id,
      storyId: storyList[storyIndex].id,
      taskIndex: index,
    });
  };

  const handleTaskDragStart = (taskId: number) => {
    if (draggingEpicId || draggingStoryId) {
      return;
    }

    setDraggingTaskId(taskId);
  };

  const handleTaskDragEnd = () => {
    const { epicId, storyId, taskIndex } = taskElementIndex;
    const storyList = epicList.find(({ id }) => epicId === id)
      ?.storyList as StoryDTO[];
    const taskList = storyList.find(({ id }) => id === storyId)
      ?.taskList as TaskDTO[];
    const currentIndex = taskList?.findIndex(({ id }) => id === draggingTaskId);

    let rankValue;

    if (taskIndex === currentIndex) {
      setDraggingTaskId(undefined);
      setTaskElementIndex({
        epicId: undefined,
        storyId: undefined,
        taskIndex: undefined,
      });
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
    setTaskElementIndex({
      epicId: undefined,
      storyId: undefined,
      taskIndex: undefined,
    });
  };

  return (
    <div className="relative flex flex-col gap-4 pb-10">
      {...epicList.map(
        ({ id: epicId, name, color, rankValue, storyList }, epicIndex) => {
          storyComponentRefList.current[epicIndex] = [];
          taskComponentRefList.current[epicIndex] = [];

          return (
            <div
              className="py-2 border-t border-b"
              onDragOver={handleEpicDragOver}
            >
              <EpicDragContainer
                {...{ epicIndex }}
                onDragStart={() => handleEpicDragStart(epicId)}
                onDragEnd={handleEpicDragEnd}
                setRef={setEpicComponentRef}
                currentlyDraggedOver={epicIndex === epicElementIndex}
              >
                <EpicBlock
                  storyExist={storyList.length > 0}
                  epic={{ id: epicId, name, color, rankValue }}
                  showStoryList={showStory[epicId]?.showStoryList}
                  onShowStoryList={() => handleShowStoryList(epicId)}
                />
              </EpicDragContainer>
              {showStory[epicId]?.showStoryList && (
                <div
                  className="w-[65rem] ml-auto"
                  onDragOver={(event) => handleStoryDragOver(event, epicIndex)}
                >
                  {...storyList.map(
                    (
                      { id: storyId, title, point, status, taskList },
                      storyIndex
                    ) => {
                      const progress = taskList.length
                        ? Math.round(
                            (taskList.filter(({ status }) => status === "완료")
                              .length /
                              taskList.length) *
                              100
                          )
                        : 0;
                      taskComponentRefList.current[epicIndex][storyIndex] = [];

                      return (
                        <div
                          className="relative"
                          onDragOver={(event) =>
                            handleTaskDragOver(event, epicIndex, storyIndex)
                          }
                        >
                          <EpicPageStoryDragContainer
                            {...{ epicIndex, storyIndex }}
                            setRef={setStoryComponentRef}
                            onDragStart={() => handleStoryDragStart(storyId)}
                            onDragEnd={handleStoryDragEnd}
                            currentlyDraggedOver={
                              epicId === storyElementIndex.epicId &&
                              storyIndex === storyElementIndex.storyIndex
                            }
                          >
                            <StoryBlock
                              {...{ id: storyId, title, point, status }}
                              epic={{ id: epicId, name, color, rankValue }}
                              progress={progress}
                              taskExist={taskList.length > 0}
                              showTaskList={showTaskList[storyId]}
                              onShowTaskList={() => handleShowTaskList(storyId)}
                            />
                          </EpicPageStoryDragContainer>
                          {showTaskList[storyId] && (
                            <TaskContainer>
                              <TaskHeader />
                              {...taskList.map((task, taskIndex) => (
                                <EpicPageTaskDragContainer
                                  {...{ epicIndex, storyIndex, taskIndex }}
                                  setRef={setTaskComponentRef}
                                  onDragStart={() =>
                                    handleTaskDragStart(task.id)
                                  }
                                  onDragEnd={handleTaskDragEnd}
                                  currentlyDraggedOver={
                                    storyId === taskElementIndex.storyId &&
                                    taskIndex === taskElementIndex.taskIndex
                                  }
                                >
                                  <TaskBlock {...task} />
                                </EpicPageTaskDragContainer>
                              ))}
                              <div
                                ref={setTaskComponentRef(
                                  epicIndex,
                                  storyIndex,
                                  taskList.length
                                )}
                                className={`${
                                  storyId === taskElementIndex.storyId &&
                                  taskElementIndex.taskIndex === taskList.length
                                    ? "w-[60.13rem] h-1 bg-blue-400"
                                    : ""
                                } absolute`}
                              />
                              <TaskCreateBlock
                                {...{ storyId }}
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
                    ref={setStoryComponentRef(epicIndex, storyList.length)}
                    className={`${
                      epicId === storyElementIndex.epicId &&
                      storyElementIndex.storyIndex === storyList.length
                        ? "w-[60.13rem] h-1 bg-blue-400"
                        : ""
                    } absolute`}
                  />
                  {showStory[epicId].showStoryForm ? (
                    <StoryCreateForm
                      epicList={epicCategoryList}
                      epic={{ id: epicId, name, color, rankValue }}
                      onCloseClick={() => handleShowStoryForm(epicId)}
                      lastStoryRankValue={
                        storyList.length
                          ? storyList[storyList.length - 1].rankValue
                          : undefined
                      }
                    />
                  ) : (
                    <StoryCreateButton
                      onClick={() => handleShowStoryForm(epicId)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        }
      )}
      <div
        ref={setEpicComponentRef(epicList.length)}
        className={`${
          epicElementIndex === epicList.length
            ? "w-[67.9rem] h-1 bg-blue-400"
            : ""
        } absolute`}
      />
    </div>
  );
};

export default EpicPage;
