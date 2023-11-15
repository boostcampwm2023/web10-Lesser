import TaskCard from './TaskCard';
import { Task } from '../../pages/sprint/SprintPage';

interface ColumnBoardProps {
  boardName: string;
  taskList: Task[];
}

const ColumnBoard = ({ boardName, taskList }: ColumnBoardProps) => (
  <div>
    <span>{boardName}</span>
    {taskList.map(({ id, title, user, point }) => (
      <TaskCard key={id} taskName={title} assignee={user} taskPoint={point} />
    ))}
  </div>
);

export default ColumnBoard;
