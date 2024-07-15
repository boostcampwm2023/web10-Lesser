import useMemberStore from "../../stores/useMemberStore";
import { LandingMemberDTO } from "../../types/DTO/landingDTO";

interface AssignedMemberDropdownProps {
  onOptionClick: (memberId: number) => void;
}

const AssignedMemberDropdown = ({
  onOptionClick,
}: AssignedMemberDropdownProps) => {
  const myInfo = useMemberStore((state) => state.myInfo);
  const partialMemberList = useMemberStore((state) => state.memberList);
  const memberList = [myInfo, ...partialMemberList];

  return (
    <div className="absolute top-0 bg-white rounded-md w-fit shadow-box">
      <ul>
        {...memberList.map((member: LandingMemberDTO) => (
          <li
            className="p-3 overflow-hidden rounded-md hover:cursor-pointer hover:bg-gray-100 text-ellipsis whitespace-nowrap"
            key={member.id}
            onClick={() => onOptionClick(member.id)}
          >
            {member.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignedMemberDropdown;
