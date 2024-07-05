import { BACKLOG_STATUS_DISPLAY } from "../../constants/backlog";
import { BacklogStatusType } from "../../types/DTO/backlogDTO";

const BacklogStatusChip = ({
  status = "시작전",
}: {
  status: BacklogStatusType;
}) => {
  const { bgColor, dotColor } = BACKLOG_STATUS_DISPLAY[status];
  return (
    <div className={`flex w-fit gap-1 px-2 items-center rounded-xl ${bgColor}`}>
      <div className={`w-[10px] h-[10px] rounded-[50%] ${dotColor}`}></div>
      <span>{status}</span>
    </div>
  );
};

export default BacklogStatusChip;
