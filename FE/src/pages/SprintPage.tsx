import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import PrograssBar from '../components/common/ProgressBar/ProgressBar';
import KanbanBoard from '../components/sprint/KanbanBoard';
import ColumnBoard from '../components/sprint/ColumnBoard';
import BoardHeader from '../components/sprint/BoardHeader';
import FilterDropdown from '../components/sprint/FilterDropdown';
import SprintEndModal from '../components/sprint/modal/SprintEndModal';
import SprintLandingPage from './sprint/SprintLandingPage';
import { Task } from '../types/sprint';
import { UserFilter, TaskGroup } from '../types/sprint';
import { transformDate } from '../utils/date';
import { useSelectedProjectState } from '../stores';
import { useGetProgressSprint, usePatchTaskState } from '../hooks/queries/sprint';
import { useModal } from '../modal/useModal';
import { useNavigate } from 'react-router-dom';

interface BoardTaskListObject {
  storyId?: number;
  storySequence?: number;
  storyTitle?: string;
  ToDo: Task[];
  InProgress: Task[];
  Done: Task[];
}

type TaskGroupedByStory = Record<number, BoardTaskListObject>;

const SprintPage = () => {
  const [taskGroup, setTaskGroup] = useState<TaskGroup>('all');
  const [userToFilter, setUserToFilter] = useState<UserFilter>(-1);
  const [dropdownOpend, setDropdownOpend] = useState<boolean>(false);
  const [boardTaskList, setBoardTaskList] = useState<BoardTaskListObject[]>([]);
  const { id: projectId, userList } = useSelectedProjectState();
  const { data, isLoading } = useGetProgressSprint(projectId);
  const { mutate } = usePatchTaskState();
  const endModal = useModal();
  const navigate = useNavigate();
  const userFilterList = useMemo(() => [{ userId: -1, userName: '전체' }, ...userList], [userList]);

  useEffect(() => {
    if (data) {
      const currentTaskList =
        userToFilter === -1 ? data.taskList : data.taskList.filter(({ userId }) => userId === userToFilter);

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
    if (data) {
      endModal.open(<SprintEndModal id={data.sprintId} close={endModal.close} projectId={projectId} />);
    }
  };

  const [todoNumber, inProgressNumber, doneNumber] = useMemo(() => {
    const currentTaskList =
      userToFilter === -1 ? data?.taskList : data?.taskList.filter(({ userId }) => userId === userToFilter);
    const todoNumber = currentTaskList?.filter(({ state }) => state === 'ToDo').length;
    const inProgressNumber = currentTaskList?.filter(({ state }) => state === 'InProgress').length;
    const doneNumber = currentTaskList?.filter(({ state }) => state === 'Done').length;

    return [todoNumber, inProgressNumber, doneNumber];
  }, [data, userToFilter]);

  if (isLoading) {
    return <div className="min-w-[60.25rem]">칸반보드 로딩중</div>;
  }

  if (data?.sprintModal) {
    return (
      <div className="flex flex-col items-center min-w-[60.25rem]">
        <p>스프린트가 종료되었습니다.</p>
        <p>회고를 진행하시겠습니까?</p>
        <button onClick={() => navigate(`/projects/${projectId}/review/sprint`)}>회고 진행하기</button>
      </div>
    );
  }

  if (data?.sprintEnd) {
    return <SprintLandingPage />;
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
                  userList={userFilterList}
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
              const { storyId, storySequence, storyTitle } = taskListByStory;

              return (
                <li key={index}>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <KanbanBoard {...{ storyId, storySequence, storyTitle }}>
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
