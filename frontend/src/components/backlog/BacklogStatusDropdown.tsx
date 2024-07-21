import { BacklogStatusType } from "../../types/DTO/backlogDTO";
import BacklogStatusChip from "./BacklogStatusChip";

interface BacklogStatusDropdownProps {
  onOptionClick: (status: BacklogStatusType) => void;
}

const BacklogStatusDropdown = ({
  onOptionClick,
}: BacklogStatusDropdownProps) => {
  const statusList: BacklogStatusType[] = ["시작전", "진행중", "완료"];

  return (
    <div className="absolute top-0 z-10 bg-white rounded-md w-fit shadow-box">
      <ul>
        {...statusList.map((status) => (
          <li
            className="p-2 hover:cursor-pointer hover:bg-gray-100"
            key={status}
            onClick={() => onOptionClick(status)}
          >
            <BacklogStatusChip status={status} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BacklogStatusDropdown;
