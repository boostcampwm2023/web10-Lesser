import { useState, useEffect } from 'react';
import PrograssBar from '../components/common/ProgressBar/ProgressBar';
import KanbanBoard from '../components/sprint/KanbanBoard';
import ColumnBoard from '../components/sprint/ColumnBoard';
import BoardHeader from '../components/sprint/BoardHeader';
import FilterDropdown from '../components/sprint/FilterDropdown';
import { Task } from '../types/sprint';
import { UserFilter, TaskGroup } from '../types/sprint';
import axios from 'axios';

type TaskGroupedByStory = Record<string, { storyNumber: number; taskList: Task[]; storyId: number }>;

const SprintPage = () => {
  const [taskGroup, setTaskGroup] = useState<TaskGroup>('all');
  const [userToFilter, setUserToFilter] = useState<UserFilter>('전체');
  const [dropdownOpend, setDropdownOpend] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [currentTaskList, setCurrentTaskList] = useState<Task[]>([]);

  useEffect(() => {
    axios.get('src/data/sprint.json').then((response) => {
      setTaskList(response.data.taskList);
      setCurrentTaskList(response.data.taskList);
    });
  }, []);

  const userList = [
    { id: 0, name: '전체' },
    { id: 1, name: '피카츄' },
    { id: 2, name: '파이리' },
    { id: 3, name: '꼬부기' },
    { id: 4, name: '잠만보' },
  ];

  const todoList = currentTaskList.filter(({ state }) => state === 'ToDo');
  const inProgressList = currentTaskList.filter(({ state }) => state === 'InProgress');
  const doneList = currentTaskList.filter(({ state }) => state === 'Done');

  // storyTitle을 기준으로 데이터를 나누기
  const tasksByStory: TaskGroupedByStory = currentTaskList.reduce((result: TaskGroupedByStory, current: Task) => {
    const storyTitle = current.storyTitle;
    result[storyTitle] = result[storyTitle] ?? {
      storyNumber: current.storyNumber,
      storyId: current.storyId,
      taskList: [],
    };
    result[storyTitle].taskList.push(current);
    return result;
  }, {});

  // 그룹화 된 칸반보드
  const storyKanbanBoards = Object.entries(tasksByStory).map(([storyTitle, { storyNumber, taskList, storyId }]) => {
    const todoList = taskList.filter(({ state }) => state === 'ToDo');
    const inProgressList = taskList.filter(({ state }) => state === 'InProgress');
    const doneList = taskList.filter(({ state }) => state === 'Done');

    return (
      <li key={storyTitle}>
        <KanbanBoard storyTitle={storyTitle} {...{ storyNumber }}>
          <ColumnBoard taskList={todoList} state="ToDo" {...{ setTaskList, storyId }} />
          <ColumnBoard taskList={inProgressList} state="InProgress" {...{ setTaskList, storyId }} />
          <ColumnBoard taskList={doneList} state="Done" {...{ setTaskList, storyId }} />
        </KanbanBoard>
      </li>
    );
  });

  const handleGroupButtonClick = (taskGroup: TaskGroup): void => {
    setTaskGroup(taskGroup);
    setDropdownOpend(false);
  };

  const handleUserFilterButtonClick = (user: UserFilter): void => {
    user === '전체'
      ? setCurrentTaskList([...taskList])
      : setCurrentTaskList([...taskList.filter(({ userName }) => user === userName)]);

    setUserToFilter(user);
    setDropdownOpend(false);
  };

  const handleFilterButtonClick = (): void => {
    setDropdownOpend((prevValue) => !prevValue);
  };

  return (
    <section className="min-w-[60.25rem]">
      <div className="flex mb-2.5">
        <h1 className="mr-2 text-2xl font-bold text-starbucks-green">스프린트 1</h1>
        <span className="self-end text-xs h-fit">백로그와 칸반보드가 보이는 이슈관리 프로토 타입을 만들자</span>
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex gap-x-8">
          <PrograssBar startText="23.11.14" endText="23.11.17" totalAmount={5} currentAmount={3} />
          <PrograssBar startText="태스크 60건" endText="완료 9건" totalAmount={60} currentAmount={9} />
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
                onClickGroupFilterButton={handleGroupButtonClick}
                onClickUserFilterButton={handleUserFilterButtonClick}
              />
            )}
          </div>
          <button className="bg-starbucks-green text-true-white rounded py-1.5 px-4 font-bold text-xs">
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
            taskNumber={todoList.length}
          />
          <BoardHeader boardName="진행 중" boardDescription="현재 진행 중인 업무" taskNumber={inProgressList.length} />
          <BoardHeader boardName="완료" boardDescription="스프린트 중 완료된 모든 업무" taskNumber={doneList.length} />
        </div>
        <ul className="flex flex-col gap-y-1.5">
          {taskGroup === 'all' ? (
            <li>
              <KanbanBoard>
                <ColumnBoard taskList={todoList} state="ToDo" {...{ setTaskList }} />
                <ColumnBoard taskList={inProgressList} state="InProgress" {...{ setTaskList }} />
                <ColumnBoard taskList={doneList} state="Done" {...{ setTaskList }} />
              </KanbanBoard>
            </li>
          ) : (
            storyKanbanBoards
          )}
        </ul>
      </div>
    </section>
  );
};

export default SprintPage;
