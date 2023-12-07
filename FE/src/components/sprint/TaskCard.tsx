import { Draggable } from 'react-beautiful-dnd';
import { useModal } from '../../modal/useModal';
import TaskModal from '../backlog/Modal/TaskModal';

interface TaskCardProps {
  userId: string | number;
  id: number;
  title: string;
  state: string;
  point: number;
  condition: string;
  sequence: number;
  index: number;
}

const TaskCard = (props: TaskCardProps) => {
  const { id, title, userId, point, index } = props;
  const { open, close } = useModal();
  const handleTaskClick = () => {
    open(<TaskModal {...props} close={close} />);
  };

  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided, snapshop) => (
        <div
          className={`flex flex-col gap-5 p-3 text-sm border rounded-lg border-transparent-green bg-cool-neutral ${
            snapshop.isDragging && 'bg-transparent-green'
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={handleTaskClick}
        >
          <p className="font-medium">{title}</p>
          <p className="flex justify-between text-starbucks-green">
            <span className="font-bold">{id}</span>
            <span>{userId}</span>
            <span>{point} point</span>
          </p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
