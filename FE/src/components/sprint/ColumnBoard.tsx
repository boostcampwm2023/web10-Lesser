import TaskCard from './TaskCard';
import { Task, TaskState } from '../../types/sprint';
import { Droppable } from 'react-beautiful-dnd';

interface ColumnBoardProps {
  taskList: Task[];
  state: TaskState;
  storyId?: number;
}

const ColumnBoard = ({ taskList, state, storyId }: ColumnBoardProps) => (
  <Droppable droppableId={`${storyId} ${state}`} type={String(storyId)}>
    {(provided) => (
      <ul
        className="flex flex-col w-[18.75rem] min-h-full gap-3 p-5 border rounded-lg border-transparent-green"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {taskList?.map((taskData, index) => (
          <li key={taskData.id}>
            <TaskCard {...{ ...taskData, index }} />
          </li>
        ))}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
);

export default ColumnBoard;
