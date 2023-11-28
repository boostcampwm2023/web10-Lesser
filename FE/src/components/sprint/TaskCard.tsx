interface TaskCardProps {
  id: number;
  title: string;
  userName?: string;
  point: number;
  storyId: number;
  onDragStart: (e: React.DragEvent, id: number, storyId: number) => void;
}

const TaskCard = ({ id, title, userName, point, storyId, onDragStart }: TaskCardProps) => (
  <div
    className="flex flex-col gap-5 p-3 text-sm border rounded-lg border-transparent-green bg-cool-neutral"
    draggable
    onDragStart={(e) => onDragStart(e, id, storyId)}
  >
    <p className="font-medium">{title}</p>
    <p className="flex justify-between text-starbucks-green">
      <span className="font-bold">{id}</span>
      <span>{userName}</span>
      <span>{point} point</span>
    </p>
  </div>
);

export default TaskCard;
