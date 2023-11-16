import TaskCard from './TaskCard';
import { Task } from '../../pages/sprint/SprintPage';

interface ColumnBoardProps {
  taskList: Task[];
}

const ColumnBoard = ({ taskList }: ColumnBoardProps) => (
  <ul className="flex flex-col gap-3 p-5 border rounded-lg w-72 border-green-stroke">
    {taskList.map(({ id, title, user, point }) => (
      <li>
        <TaskCard key={id} id={id} title={title} assignee={user} point={point} />
      </li>
    ))}
  </ul>
);

export default ColumnBoard;
