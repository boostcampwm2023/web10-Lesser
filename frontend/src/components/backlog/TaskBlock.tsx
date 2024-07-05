import { TaskDTO } from "../../types/DTO/backlogDTO";
import BacklogStatusChip from "./BacklogStatusChip";
import CategoryChip from "./CategoryChip";

const TaskBlock = ({
  displayId,
  title,
  assignedMemberId,
  expectedTime,
  actualTime,
  status,
}: TaskDTO) => (
  <div className="flex items-center justify-between py-1 border-b">
    <p className="w-12">Task-{displayId}</p>
    <p className="w-[25rem]">{title}</p>
    <div className="w-12">
      {assignedMemberId && (
        <CategoryChip content={`${assignedMemberId}`} bgColor="green" />
      )}
    </div>
    <div className="w-16 ">
      <p className="max-w-full text-right">{expectedTime}</p>
    </div>
    <div className="w-16 ">
      <p className="max-w-full text-right">{actualTime}</p>
    </div>
    <div className="w-[6.25rem]">
      <BacklogStatusChip status={status} />
    </div>
  </div>
);

export default TaskBlock;
