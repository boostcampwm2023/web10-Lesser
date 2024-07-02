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
    <div className="rounded-md w-fit shadow-box">
      <ul>
        {...memberList.map((member: LandingMemberDTO) => (
          <li
            className="p-2 hover:cursor-pointer hover:bg-gray-100"
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
