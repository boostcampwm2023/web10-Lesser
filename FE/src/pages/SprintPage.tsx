import { useState, useEffect, useMemo } from 'react';
import PrograssBar from '../components/common/ProgressBar/ProgressBar';
import KanbanBoard from '../components/sprint/KanbanBoard';
import ColumnBoard from '../components/sprint/ColumnBoard';
import BoardHeader from '../components/sprint/BoardHeader';
import FilterDropdown from '../components/sprint/FilterDropdown';
import { Task } from '../types/sprint';
import { UserFilter, TaskGroup } from '../types/sprint';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router';
import { api } from '../apis/api';
import { transformDate } from '../utils/date';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface BoardTaskListObject {
  storyId?: number;
  storyNumber?: number;
  storyTitle?: string;
  ToDo: Task[];
  InProgress: Task[];
  Done: Task[];
}

interface Sprint {
  sprintTitle: string;
  sprintGoal: string;
  sprintStartDate: string;
  sprintEndDate: string;
  sprintEnd: boolean;
  sprintModal: boolean;
  taskList: Task[];
}

type TaskGroupedByStory = Record<number, BoardTaskListObject>;

const SprintPage = () => {
  const [taskGroup, setTaskGroup] = useState<TaskGroup>('all');
  const [userToFilter, setUserToFilter] = useState<UserFilter>(undefined);
  const [dropdownOpend, setDropdownOpend] = useState<boolean>(false);
  const [boardTaskList, setBoardTaskList] = useState<BoardTaskListObject[]>([]);
  const { data, isLoading } = useQuery<Sprint>({
    queryKey: ['sprint'],
    queryFn: async () => {
      const response = await api.get('/projects/1/sprints/progress');
      return response.data;
    },
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({ id, state }: { id: number; state: string }) =>
      await api.patch('/backlogs/task', { id, state }),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const currentTaskList = !userToFilter
        ? data.taskList
        : data.taskList.filter(({ userId }) => userId === userToFilter);

      if (taskGroup === 'all') {
        const ToDo = currentTaskList?.filter(({ state }: Task) => state === 'ToDo');
        const InProgress = currentTaskList?.filter(({ state }: Task) => state === 'InProgress');
        const Done = currentTaskList?.filter(({ state }: Task) => state === 'Done');
        const newBoardTaskLists = { ToDo, InProgress, Done };
        setBoardTaskList([newBoardTaskLists]);

        return;
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

      setBoardTaskList(Object.values(taskList));
    }
  }, [data, userToFilter, taskGroup]);

  const userList = [
    { name: '전체' },
    { id: '1', name: '피카츄' },
    { id: '2', name: '파이리' },
    { id: '3', name: '꼬부기' },
    { id: '4', name: '잠만보' },
  ];

  const handleGroupButtonClick = (taskGroup: TaskGroup): void => {
    setTaskGroup(taskGroup);
    setDropdownOpend(false);
  };

  const handleUserFilterButtonClick = (user: UserFilter): void => {
    setUserToFilter(user);
    setDropdownOpend(false);
  };

  const handleFilterButtonClick = (): void => {
    setDropdownOpend((prevValue) => !prevValue);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    const [sourceStoryId] = source.droppableId.split(' ');

    if (!destination) {
      return;
    }

    const [destinationStoryId, state] = destination.droppableId.split(' ');

    if (sourceStoryId !== destinationStoryId) {
      return;
    }

    mutate({ id: Number(draggableId), state });
  };

  const handleSprintEndButtonClick = () => {
    navigate('/review');
  };

  const [todoNumber, inProgressNumber, doneNumber] = useMemo(() => {
    const currentTaskList = !userToFilter
      ? data?.taskList
      : data?.taskList.filter(({ userId }) => userId === userToFilter);
    const todoNumber = currentTaskList?.filter(({ state }) => state === 'ToDo').length;
    const inProgressNumber = currentTaskList?.filter(({ state }) => state === 'InProgress').length;
    const doneNumber = currentTaskList?.filter(({ state }) => state === 'Done').length;

    return [todoNumber, inProgressNumber, doneNumber];
  }, [data, userToFilter]);

  if (isLoading) {
    return <div>칸반보드 로딩중</div>;
  }

  if (data) {
    return (
      <section className="min-w-[60.25rem]">
        <div className="flex mb-2.5">
          <h1 className="mr-2 text-2xl font-bold text-starbucks-green">{data.sprintTitle}</h1>
          <span className="self-end text-xs h-fit">{data.sprintGoal}</span>
        </div>
        <div className="flex justify-between mb-4">
          <div className="flex gap-x-8">
            <PrograssBar
              startText={transformDate(data.sprintStartDate)}
              endText={transformDate(data.sprintEndDate)}
              totalAmount={6}
              currentAmount={4}
            />
            <PrograssBar
              startText={`태스크 ${data.taskList.length}건`}
              endText={`완료 ${doneNumber ? doneNumber : 0}건`}
              totalAmount={data.taskList.length}
              currentAmount={doneNumber ? doneNumber : 0}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={handleFilterButtonClick}
                className="bg-starbucks-green text-true-white rounded py-1.5 px-4 font-bold text-xs"
              >
                필터
              </button>
              {dropdownOpend && (
                <FilterDropdown
                  userList={userList}
                  userToFilter={userToFilter}
                  taskGroup={taskGroup}
                  onGroupFilterButtonClick={handleGroupButtonClick}
                  onUserFilterButtonClick={handleUserFilterButtonClick}
                />
              )}
            </div>
            <button
              className="bg-starbucks-green text-true-white rounded py-1.5 px-4 font-bold text-xs"
              onClick={handleSprintEndButtonClick}
            >
              스프린트 완료
            </button>
          </div>
        </div>
        <hr className="mb-2.5 bg-green-stroke border" />
        <div>
          <div className="flex justify-between gap-8">
            <BoardHeader
              boardName="할 일"
              boardDescription="스프린트 내 아직 진행되지 않은 업무"
              taskNumber={todoNumber}
            />
            <BoardHeader boardName="진행 중" boardDescription="현재 진행 중인 업무" taskNumber={inProgressNumber} />
            <BoardHeader boardName="완료" boardDescription="스프린트 중 완료된 모든 업무" taskNumber={doneNumber} />
          </div>
          <ul className="flex flex-col gap-y-1.5">
            {boardTaskList?.map((taskListByStory, index) => {
              const { storyId, storyNumber, storyTitle } = taskListByStory;

              return (
                <li key={index}>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <KanbanBoard {...{ storyId, storyNumber, storyTitle }}>
                      <ColumnBoard taskList={taskListByStory?.ToDo} state="ToDo" {...{ storyId }} />
                      <ColumnBoard taskList={taskListByStory?.InProgress} state="InProgress" {...{ storyId }} />
                      <ColumnBoard taskList={taskListByStory?.Done} state="Done" {...{ storyId }} />
                    </KanbanBoard>
                  </DragDropContext>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }
};

export default SprintPage;
