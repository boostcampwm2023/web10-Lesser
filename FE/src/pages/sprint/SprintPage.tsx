import { useState } from 'react';
import PrograssBar from '../../components/common/ProgressBar/ProgressBar';
import KanbanBoard from '../../components/sprint/KanbanBoard';

export interface Task {
  id: number;
  title: string;
  user: string;
  point: number;
  state: 'ToDo' | 'InProgress' | 'Done';
  storyName: string;
}

interface Data {
  taskList: Task[];
}

type TaskGroupedByStory = Record<string, Task[]>;

const SprintPage = () => {
  const [taskGroup, setTaskGroup] = useState<'all' | 'group'>('all');

  const data: Data = {
    taskList: [
      {
        storyName: '스토리1',
        id: 2,
        title: '로그인 DB저장',
        user: '1',
        point: 3,
        state: 'ToDo',
      },
      {
        storyName: '스토리2',
        id: 3,
        title: 'API작성하기',
        user: '4',
        point: 5,
        state: 'ToDo',
      },
      {
        storyName: '스토리1',
        id: 4,
        title: '회원가입 기능 구현',
        user: '3',
        point: 4,
        state: 'InProgress',
      },
      {
        storyName: '스토리3',
        id: 5,
        title: 'UI 디자인',
        user: '4',
        point: 2,
        state: 'Done',
      },
    ],
  };

  // storyName을 기준으로 데이터를 나누기
  const tasksByStory: TaskGroupedByStory = data.taskList.reduce((result: TaskGroupedByStory, current: Task) => {
    const storyName = current.storyName;
    result[storyName] = result[storyName] ?? [];
    result[storyName].push(current);
    return result;
  }, {});

  const storyKanbanBoards = Object.entries(tasksByStory).map(([storyName, taskList]) => (
    <KanbanBoard key={storyName} storyName={storyName} taskList={taskList} />
  ));

  const handleGroupButtonClick = () => {
    setTaskGroup((taskGroup) => (taskGroup === 'all' ? 'group' : 'all'));
  };

  return (
    <>
      <header>
        <h1>스프린트 1</h1>
        <span>백로그와 칸반보드가 보이는 이슈관리 프로토 타입을 만들자</span>
      </header>
      <div>
        <div>
          <PrograssBar startText="23.11.14" endText="23.11.17" totalAmount={5} currentAmount={3} />
          <PrograssBar startText="태스크 60건" endText="완료 9건" totalAmount={60} currentAmount={9} />
        </div>
        <div>
          <button onClick={handleGroupButtonClick}>전체 태스크</button>
          <button onClick={handleGroupButtonClick}>스토리 그룹화</button>
        </div>
      </div>
      <div>{taskGroup === 'all' ? <KanbanBoard taskList={data.taskList} /> : storyKanbanBoards}</div>
    </>
  );
};

export default SprintPage;
