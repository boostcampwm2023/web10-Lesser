import { Task } from '../../pages/sprint/SprintPage';
import ColumnBoard from './ColumnBoard';

interface KanbanBoardProps {
  storyName?: string;
  taskList: Task[];
}

const KanbanBoard = ({ storyName, taskList }: KanbanBoardProps) => {
  const todoList = taskList.filter(({ state }) => state === 'ToDo');
  const inProgressList = taskList.filter(({ state }) => state === 'InProgress');
  const doneList = taskList.filter(({ state }) => state === 'Done');

  return (
    <div>
      {storyName && <span>{storyName}</span>}
      <div>
        <ColumnBoard boardName="Todo" taskList={todoList} />
        <ColumnBoard boardName="In Progress" taskList={inProgressList} />
        <ColumnBoard boardName="Done" taskList={doneList} />
      </div>
    </div>
  );
};

export default KanbanBoard;
