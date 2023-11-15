interface TaskCardProps {
  taskName: string;
  assignee?: string;
  taskPoint: number;
}

const TaskCard = ({ taskName, assignee, taskPoint }: TaskCardProps) => (
  <div>
    <span>{taskName}</span>
    <div>
      <span>{assignee}</span>
      <span>{taskPoint}시간</span>
    </div>
  </div>
);

export default TaskCard;
