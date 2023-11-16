interface TaskCardProps {
  id: number;
  title: string;
  assignee?: string;
  point: number;
}

const TaskCard = ({ id, title, assignee, point }: TaskCardProps) => (
  <div className="flex flex-col gap-5 p-3 text-sm border rounded-lg border-green-stroke bg-cool-neutral">
    <p className="font-medium">{title}</p>
    <p className="flex justify-between text-starbucks-green">
      <span className="font-bold">{id}</span>
      <span>{assignee}</span>
      <span>{point} point</span>
    </p>
  </div>
);

export default TaskCard;
