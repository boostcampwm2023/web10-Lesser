import { TaskData } from './TaskModal';

interface TaskBlockProps {
  taskData: TaskData;
}

const TaskBlock = ({ taskData }: TaskBlockProps) => (
  <div className="border-2 border-green-600">
    <h4>Title: {taskData.title}</h4>
    <p>Point: {taskData.point}</p>
    <p>Member: {taskData.member}</p>
    <p>Completion Condition: {taskData.completionCondition}</p>
  </div>
);

export default TaskBlock;
