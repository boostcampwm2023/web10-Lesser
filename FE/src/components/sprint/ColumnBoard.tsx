import TaskCard from './TaskCard';
import { Task } from '../../types/sprint';

interface ColumnBoardProps {
  taskList: Task[];
}

const ColumnBoard = ({ taskList }: ColumnBoardProps) => (
  <ul className="flex flex-col w-[18.75rem] min-h-full gap-3 p-5 border rounded-lg border-transparent-green">
    {taskList.map(({ id, title, userName, point }) => (
      <li key={id}>
        <TaskCard id={id} title={title} assignee={userName} point={point} />
      </li>
    ))}
  </ul>
);

export default ColumnBoard;
