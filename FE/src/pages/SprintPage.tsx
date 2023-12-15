import { useState, useMemo } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import PrograssBar from '../components/common/ProgressBar/ProgressBar';
import KanbanBoard from '../components/sprint/KanbanBoard';
import ColumnBoard from '../components/sprint/ColumnBoard';
import BoardHeader from '../components/sprint/BoardHeader';
import FilterDropdown from '../components/sprint/FilterDropdown';
import SprintEndModal from '../components/sprint/modal/SprintEndModal';
import SprintLandingPage from './sprint/SprintLandingPage';
import { ReturnedSprint, Task } from '../types/sprint';
import { UserFilter, TaskGroup } from '../types/sprint';
import { calculateRestDate, transformDate } from '../utils/date';
import { useSelectedProjectState } from '../stores';
import { useGetProgressSprint, usePatchTaskState } from '../hooks/queries/sprint';
import { useModal } from '../modal/useModal';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import structureTaskList from '../utils/structureTaskList';
import useFilterState from '../stores/useFilterState';

const SprintPage = () => {
  const { userToFilter, taskGroup, changeTaskGroup, changeUserToFilter } = useFilterState();
  const [dropdownOpend, setDropdownOpend] = useState<boolean>(false);
  const { id: projectId, userList, getUserNameById } = useSelectedProjectState();
  const { data, isLoading, isError } = useGetProgressSprint({ projectId, userToFilter, taskGroup });
  const { mutateAsync } = usePatchTaskState();
  const endModal = useModal();
  const navigate = useNavigate();
  const userFilterList = useMemo(
    () => [{ userId: -1, userName: '전체' }, ...userList, { userId: null, userName: '미할당' }],
    [userList],
  );
  const queryClient = useQueryClient();

  const handleGroupButtonClick = (user: UserFilter, taskGroup: TaskGroup): void => {
    queryClient.setQueryData(['sprint'], (prevSprintData: ReturnedSprint) => {
      const boardTask = structureTaskList(prevSprintData.taskList, user, taskGroup);
      return { ...prevSprintData, boardTask };
    });

    changeTaskGroup(taskGroup);
    setDropdownOpend(false);
  };

  const handleUserFilterButtonClick = (user: UserFilter, taskGroup: TaskGroup): void => {
    queryClient.setQueryData(['sprint'], (prevSprintData: ReturnedSprint) => {
      const boardTask = structureTaskList(prevSprintData.taskList, user, taskGroup);
      return { ...prevSprintData, boardTask };
    });

    changeUserToFilter(user);
    setDropdownOpend(false);
  };

  const handleFilterButtonClick = (): void => {
    setDropdownOpend((prevValue) => !prevValue);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    const [sourceStoryId, sourceState] = source.droppableId.split(' ');

    if (!destination) {
      return;
    }

    const [destinationStoryId, state] = destination.droppableId.split(' ');

    if (sourceStoryId !== destinationStoryId) {
      return;
    }

    queryClient.setQueryData(['sprint'], (prevSprintData: ReturnedSprint) => {
      const taskList = structuredClone(prevSprintData.taskList);
      const targetTask = taskList.find(({ id }) => id === Number(draggableId));
      if (targetTask) {
        targetTask.state = state;
      }

      const boardTask = structuredClone(prevSprintData.boardTask);
      boardTask[Number(sourceStoryId)][sourceState as 'ToDo' | 'InProgress' | 'Done'].splice(source.index, 1);
      boardTask[Number(destinationStoryId)][state as 'ToDo' | 'InProgress' | 'Done'].splice(
        destination.index,
        0,
        targetTask as Task,
      );

      return { ...prevSprintData, taskList, boardTask };
    });

    mutateAsync({ id: Number(draggableId), state });
  };

  const handleSprintEndButtonClick = () => {
    if (data) {
      endModal.open(<SprintEndModal id={data.sprintId} close={endModal.close} projectId={projectId} />);
    }
  };

  const [todoNumber, inProgressNumber, doneNumber] = useMemo(() => {
    const todoNumber = data?.taskList?.filter(({ state }) => state === 'ToDo').length;
    const inProgressNumber = data?.taskList?.filter(({ state }) => state === 'InProgress').length;
    const doneNumber = data?.taskList?.filter(({ state }) => state === 'Done').length;

    return [todoNumber, inProgressNumber, doneNumber];
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-w-[60.25rem]">
        <p>칸반보드 로딩중입니다.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="felx flex-col items-center justify-center min-w-[60.25rem]">
        <p>오류가 발생했습니다.</p>
        <p>다시 시도해주세요.</p>
      </div>
    );
  }

  if (data?.sprintModal) {
    return (
      <div className="flex flex-col items-center justify-center min-w-[60.25rem]">
        <p>스프린트가 종료되었습니다.</p>
        <p>회고를 진행하시겠습니까?</p>
        <button
          className="p-3 rounded bg-starbucks-green text-true-white"
          onClick={() => navigate(`/projects/${projectId}/review`)}
        >
          회고 진행하기
        </button>
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
              totalAmount={calculateRestDate(data.sprintStartDate, data.sprintEndDate)}
              currentAmount={calculateRestDate(data.sprintStartDate, new Date().toString())}
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
                {userToFilter === -1 ? '필터' : userToFilter === null ? '미할당' : getUserNameById(userToFilter)}
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
            {Object.values(data.boardTask).map((taskListByStory, index) => {
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
