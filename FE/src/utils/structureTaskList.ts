import { Task, TaskGroup, TaskGroupedByStory, UserFilter } from '../types/sprint';

const structureTaskList = (data: Task[], user: UserFilter = -1, group: TaskGroup = 'all') => {
  const copiedData = structuredClone(data);

  const currentTaskList = user === -1 ? copiedData : copiedData.filter(({ userId }) => userId === user);

  if (group === 'all') {
    const ToDo = currentTaskList?.filter(({ state }: Task) => state === 'ToDo');
    const InProgress = currentTaskList?.filter(({ state }: Task) => state === 'InProgress');
    const Done = currentTaskList?.filter(({ state }: Task) => state === 'Done');
    const newBoardTask = { 0: { ToDo, InProgress, Done, storyId: 0 } };
    return newBoardTask;
  }

  const taskList = currentTaskList?.reduce((acc: TaskGroupedByStory, current: Task) => {
    const { storyId, storySequence, storyTitle } = current;
    acc[storyId] = acc[storyId] ?? {
      storySequence,
      storyId,
      storyTitle,
      ToDo: [],
      InProgress: [],
      Done: [],
    };

    const taskState = current.state;
    acc[storyId][taskState as 'ToDo' | 'InProgress' | 'Done'].push(current);

    return acc;
  }, {});

  return taskList;
};

export default structureTaskList;
