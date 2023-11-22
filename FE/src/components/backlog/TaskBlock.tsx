import { TaskData } from '../../types/backlog';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';

interface TaskBlockProps {
  taskData: TaskData;
}

const TaskBlock = ({ taskData }: TaskBlockProps) => (
  <div className="flex border-t py-2 px-4 gap-16 text-house-green text-r whitespace-nowrap ">
    <p className="font-bold">Task</p>
    <p className="w-full">Title: {taskData.title}</p>
    <p>{taskData.point} POINT</p>
    <p>멤버 {taskData.member}</p>
    <button className="flex items-center font-bold">
      상세보기 <ChevronRightIcon size={14} />
    </button>
  </div>
);

export default TaskBlock;
