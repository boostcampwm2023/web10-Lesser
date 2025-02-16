import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  BacklogDTO,
  EpicDTO,
  StoryDTO,
  TaskDTO,
} from "../../../types/DTO/backlogDTO";
import {
  BacklogSocketData,
  BacklogSocketDomain,
  BacklogSocketEpicAction,
  BacklogSocketStoryAction,
  BacklogSocketTaskAction,
} from "../../../types/common/backlog";

const useBacklogSocket = (socket: Socket) => {
  const [backlog, setBacklog] = useState<BacklogDTO>({ epicList: [] });

  const handleInitEvent = (content: { backlog: BacklogDTO }) => {
    if (!Object.keys(content).length) {
      return;
    }
    setBacklog(content.backlog);
  };

  const handleEpicEvent = (
    action: BacklogSocketEpicAction,
    content: EpicDTO
  ) => {
    switch (action) {
      case BacklogSocketEpicAction.CREATE:
        const newEpic = { ...content, storyList: [] };
        setBacklog((prevBacklog) => ({
          epicList: [...prevBacklog.epicList, newEpic],
        }));
        break;
      case BacklogSocketEpicAction.DELETE:
        setBacklog((prevBacklog) => ({
          epicList: prevBacklog.epicList.filter(({ id }) => id !== content.id),
        }));
        break;
      case BacklogSocketEpicAction.UPDATE:
        setBacklog((prevBacklog) => ({
          epicList: prevBacklog.epicList.map((epic) => {
            if (epic.id === content.id) {
              return { ...epic, ...content };
            }
            return epic;
          }),
        }));
        break;
    }
  };

  const handleStoryEvent = (
    action: BacklogSocketStoryAction,
    content: StoryDTO
  ) => {
    switch (action) {
      case BacklogSocketStoryAction.CREATE:
        setBacklog((prevBacklog) => {
          const newEpicList = prevBacklog.epicList.map((epic) => {
            if (epic.id === content.epicId) {
              const newStoryList = [
                ...epic.storyList,
                { ...content, taskList: [] },
              ];
              return { ...epic, storyList: newStoryList };
            }

            return epic;
          });
          return { epicList: newEpicList };
        });
        break;
      case BacklogSocketStoryAction.UPDATE:
        if (content.epicId) {
          setBacklog((prevBacklog) => {
            let targetStory: StoryDTO | null = null;
            prevBacklog.epicList.some((epic) => {
              const foundStory = epic.storyList.find(
                (story) => story.id === content.id
              );
              if (foundStory) {
                targetStory = { ...foundStory };
                return true;
              }
              return false;
            });

            if (!targetStory) {
              return prevBacklog;
            }

            const newEpicList = prevBacklog.epicList.map((epic) => {
              const newStoryList = epic.storyList.filter((story) => {
                if (story.id === content.id) {
                  targetStory = { ...story, ...content };
                }
                return story.id !== content.id;
              });

              if (epic.id === content.epicId) {
                newStoryList.push(targetStory as StoryDTO);
              }
              return { ...epic, storyList: newStoryList };
            });

            return { epicList: newEpicList };
          });

          break;
        }

        setBacklog((prevBacklog) => {
          const newEpicList = prevBacklog.epicList.map((epic) => {
            const newStoryList = epic.storyList.map((story) => {
              if (story.id === content.id) {
                return { ...story, ...content };
              }
              return story;
            });
            return { ...epic, storyList: newStoryList };
          });
          return { epicList: newEpicList };
        });

        break;
      case BacklogSocketStoryAction.DELETE:
        setBacklog((prevBacklog) => {
          const newEpicList = prevBacklog.epicList.map((epic) => {
            const newStoryList = epic.storyList.filter(
              ({ id }) => id !== content.id
            );
            return { ...epic, storyList: newStoryList };
          });

          return { epicList: newEpicList };
        });
        break;
    }
  };

  const handleTaskEvent = (
    action: BacklogSocketTaskAction,
    content: TaskDTO
  ) => {
    switch (action) {
      case BacklogSocketTaskAction.CREATE:
        setBacklog((prevBacklog) => {
          const newEpicList = prevBacklog.epicList.map((epic) => {
            if (
              epic.storyList.filter(({ id }) => id === content.storyId).length
            ) {
              const newStoryList = epic.storyList.map((story) => {
                if (story.id === content.storyId) {
                  return { ...story, taskList: [...story.taskList, content] };
                }
                return story;
              });

              return { ...epic, storyList: newStoryList };
            }
            return epic;
          });
          return { epicList: newEpicList };
        });
        break;
      case BacklogSocketTaskAction.UPDATE:
        if (content.storyId) {
          setBacklog((prevBacklog) => {
            let targetTask: TaskDTO | null = null;
            prevBacklog.epicList.some((epic) => {
              epic.storyList.some((story) => {
                const foundTask = story.taskList.find(
                  (task) => task.id === content.id
                );

                if (foundTask) {
                  targetTask = { ...foundTask };
                  return true;
                }

                return false;
              });

              if (targetTask) {
                return true;
              }

              return false;
            });

            if (!targetTask) {
              return prevBacklog;
            }

            const newEpicList = prevBacklog.epicList.map((epic) => {
              const newStoryList = epic.storyList.map((story) => {
                const newTaskList = story.taskList.filter(
                  (task) => task.id !== content.id
                );

                if (story.id === content.storyId) {
                  newTaskList.push({
                    ...targetTask,
                    ...content,
                  } as TaskDTO);
                }
                return { ...story, taskList: newTaskList };
              });

              return { ...epic, storyList: newStoryList };
            });
            return { epicList: newEpicList };
          });
          break;
        }

        setBacklog((prevBacklog) => {
          const newEpicList = prevBacklog.epicList.map((epic) => {
            const newStoryList = epic.storyList.map((story) => {
              const newTaskList = story.taskList.map((task) => {
                if (task.id === content.id) {
                  return { ...task, ...content };
                }

                return task;
              });

              return { ...story, taskList: newTaskList };
            });
            return { ...epic, storyList: newStoryList };
          });

          return { epicList: newEpicList };
        });

        break;
      case BacklogSocketTaskAction.DELETE:
        setBacklog((prevBacklog) => {
          const newEpicList = prevBacklog.epicList.map((epic) => {
            const newStoryList = epic.storyList.map((story) => {
              const newTaskList = story.taskList.filter(
                ({ id }) => id !== content.id
              );

              return { ...story, taskList: newTaskList };
            });
            return { ...epic, storyList: newStoryList };
          });

          return { epicList: newEpicList };
        });
        break;
    }
  };

  const handleOnBacklog = ({ domain, action, content }: BacklogSocketData) => {
    switch (domain) {
      case BacklogSocketDomain.BACKLOG:
        handleInitEvent(content);
        break;
      case BacklogSocketDomain.EPIC:
        handleEpicEvent(action, content);
        break;
      case BacklogSocketDomain.STORY:
        handleStoryEvent(action, content);
        break;
      case BacklogSocketDomain.TASK:
        handleTaskEvent(action, content);
        break;
    }
  };

  useEffect(() => {
    socket.emit("joinBacklog");
    socket.on("backlog", handleOnBacklog);

    return () => {
      socket.off("backlog", handleOnBacklog);
    };
  }, []);

  return { backlog };
};

export default useBacklogSocket;
