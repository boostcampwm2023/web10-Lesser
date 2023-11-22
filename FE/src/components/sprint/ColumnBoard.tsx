import TaskCard from './TaskCard';
import { Task } from '../../types/sprint';

interface ColumnBoardProps {
  taskList: Task[];
}

const ColumnBoard = ({ taskList }: ColumnBoardProps) => (
  <ul className="flex flex-col w-4/12 min-h-full gap-3 p-5 border rounded-lg border-green-stroke">
    {taskList.map(({ id, title, userName, point }) => (
      <li>
        <TaskCard key={id} id={id} title={title} assignee={userName} point={point} />
      </li>
    ))}
  </ul>
);

export default ColumnBoard;
