import { Draggable } from 'react-beautiful-dnd';

interface TaskCardProps {
  id: number;
  title: string;
  userId?: number;
  point: number;
  storyId: number;
  index: number;
}

const TaskCard = ({ id, title, userId, point, index }: TaskCardProps) => (
  <Draggable draggableId={String(id)} index={index}>
    {(provided, snapshop) => (
      <div
        className={`flex flex-col gap-5 p-3 text-sm border rounded-lg border-transparent-green bg-cool-neutral ${
          snapshop.isDragging && 'bg-transparent-green'
        }`}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
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

export default TaskCard;
