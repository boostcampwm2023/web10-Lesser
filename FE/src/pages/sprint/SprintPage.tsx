import { useState } from 'react';
import PrograssBar from '../../components/common/ProgressBar/ProgressBar';
import KanbanBoard from '../../components/sprint/KanbanBoard';
import BoardHeader from '../../components/sprint/BoardHeader';
import FilterDropdown from '../../components/sprint/FilterDropdown';
import { UserFilter, TaskGroup } from '../../types/sprint';

export interface Task {
  id: number;
  title: string;
  userName: string;
  point: number;
  state: 'ToDo' | 'InProgress' | 'Done';
  storyTitle: string;
}

interface Data {
  taskList: Task[];
}

type TaskGroupedByStory = Record<string, Task[]>;

const data: Data = {
  taskList: [
    {
      storyTitle: '유저는 로그인할 수 있다.',
      id: 2,
      title: '로그인 DB저장',
      userName: '승민',
      point: 3,
      state: 'ToDo',
    },
    {
      storyTitle: '유저는 에픽을 생성할 수 있다.',
      id: 3,
      title: 'API작성하기',
      userName: '수린',
      point: 5,
      state: 'ToDo',
    },
    {
      storyTitle: '유저는 로그인할 수 있다.',
      id: 4,
      title: '회원가입 기능 구현',
      userName: '승민',
      point: 4,
      state: 'InProgress',
    },
    {
      storyTitle: '유저는 칸반보드를 조회할 수 있다.',
      id: 5,
      title: 'UI 디자인',
      userName: '용현',
      point: 2,
      state: 'Done',
    },
  ],
};

const SprintPage = () => {
  const [taskGroup, setTaskGroup] = useState<TaskGroup>('all');
  const [userToFilter, setUserToFilter] = useState<UserFilter>('전체');
  const [dropdownOpend, setDropdownOpend] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<Task[]>(data.taskList);

  const todoList = taskList.filter(({ state }) => state === 'ToDo');
  const inProgressList = taskList.filter(({ state }) => state === 'InProgress');
  const doneList = taskList.filter(({ state }) => state === 'Done');

  // storyTitle을 기준으로 데이터를 나누기
  const tasksByStory: TaskGroupedByStory = taskList.reduce((result: TaskGroupedByStory, current: Task) => {
    const storyTitle = current.storyTitle;
    result[storyTitle] = result[storyTitle] ?? [];
    result[storyTitle].push(current);
    return result;
  }, {});

  const storyKanbanBoards = Object.entries(tasksByStory).map(([storyTitle, taskList]) => {
    const todoList = taskList.filter(({ state }) => state === 'ToDo');
    const inProgressList = taskList.filter(({ state }) => state === 'InProgress');
    const doneList = taskList.filter(({ state }) => state === 'Done');
    return (
      <li>
        <KanbanBoard
          key={storyTitle}
          storyTitle={storyTitle}
          storyId="LES-12"
          todoList={todoList}
          inProgressList={inProgressList}
          doneList={doneList}
        />
      </li>
    );
  });

  const handleGroupButtonClick = (taskGroup: TaskGroup): void => {
    setTaskGroup(taskGroup);
    setDropdownOpend(false);
  };

  const handleUserFilterButtonClick = (user: UserFilter): void => {
    user === '전체'
      ? setTaskList([...data.taskList])
      : setTaskList([...data.taskList.filter(({ userName }) => user === userName)]);
    setUserToFilter(user);
    setDropdownOpend(false);
  };

  const handleFilterButtonClick = (): void => {
    setDropdownOpend((prevValue) => !prevValue);
  };

  return (
    <section className="p-4">
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
                userList={[{ name: '전체' }, { id: 4, name: '수린' }, { id: 2, name: '용현' }, { id: 1, name: '승민' }]}
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
        <div className="flex justify-between">
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
              <KanbanBoard todoList={todoList} inProgressList={inProgressList} doneList={doneList} />
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
