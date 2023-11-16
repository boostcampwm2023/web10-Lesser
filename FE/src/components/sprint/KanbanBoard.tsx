import { Task } from '../../pages/sprint/SprintPage';
import ColumnBoard from './ColumnBoard';

interface KanbanBoardProps {
  storyTitle?: string;
  storyId?: string;
  todoList: Task[];
  inProgressList: Task[];
  doneList: Task[];
}

const KanbanBoard = ({ storyId, storyTitle, todoList, inProgressList, doneList }: KanbanBoardProps) => (
  <div>
    {storyTitle && (
      <p className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-bold text-starbucks-green">{storyId}</span>
        <span className="text-xs font-medium ">{storyTitle}</span>
      </p>
    )}
    <div className="flex justify-between">
      <ColumnBoard taskList={todoList} />
      <ColumnBoard taskList={inProgressList} />
      <ColumnBoard taskList={doneList} />
    </div>
  </div>
);

export default KanbanBoard;
