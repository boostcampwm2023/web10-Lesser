import TaskCard from './TaskCard';
import { Task, TaskState } from '../../types/sprint';
import useKanbanDrag from '../../hooks/useKanbanDrag';

interface ColumnBoardProps {
  taskList: Task[];
  state: TaskState;
  storyId?: number;
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
}

const ColumnBoard = ({ taskList, state, storyId, setTaskList }: ColumnBoardProps) => {
  const { handleDragStart, handleDragOver, handleDragDrop } = useKanbanDrag(setTaskList);

  return (
    <ul
      className="flex flex-col w-[18.75rem] min-h-full gap-3 p-5 border rounded-lg border-transparent-green"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDragDrop(e, state, storyId)}
    >
      {taskList.map(({ id, title, userName, point, storyId }) => (
        <li key={id}>
          <TaskCard {...{ title, userName, point, id, storyId }} onDragStart={handleDragStart} />
        </li>
      ))}
    </ul>
  );
};

export default ColumnBoard;
