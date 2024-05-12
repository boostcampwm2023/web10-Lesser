import { USER_STATUS_WORD, USER_WORD_STATUS } from "../../../constants/landing";
import UserBlock from "./UserBlock";
import useDropdown from "../../../hooks/common/dropdown/useDropdown";
import { memberResponse } from "../../../types/DTO/authDTO";
import { LandingMemberDTO, MemberStatus } from "../../../types/DTO/landingDTO";
import { DEFAULT_MEMBER } from "../../../constants/projects";
import { useEffect } from "react";

interface LandingMemberProps {
  member: LandingMemberDTO[];
  myInfo: LandingMemberDTO;
  inviteLinkIdRef: React.MutableRefObject<string>;
  projectTitle: string;
  memberSocketEvent: {
    emitMemberStatusUpdate: (content: LandingMemberDTO) => void;
  };
}

const LandingMember = ({
  member,
  myInfo,
  inviteLinkIdRef,
  projectTitle,
  memberSocketEvent,
}: LandingMemberProps) => {
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: "내 상태",
    options: ["접속 중", "부재 중", "자리비움"],
    defaultOption: USER_STATUS_WORD[myInfo.status],
  });
  const { emitMemberStatusUpdate } = memberSocketEvent;

  const userData: memberResponse = JSON.parse(
    window.localStorage.getItem("member") ?? DEFAULT_MEMBER
  );
  const imageUrl = myInfo.imageUrl ?? userData.imageUrl;
  const username = myInfo.username ?? userData.username;

  const handleInviteButtonClick = () => {
    window.navigator.clipboard
      .writeText(
        `${window.location.origin}/projects/invite/${projectTitle.replace(
          /\s/g,
          ""
        )}/${inviteLinkIdRef.current}`
      )
      .then(() => {
        alert("초대링크가 복사되었습니다.");
      });
  };

  useEffect(() => {
    emitMemberStatusUpdate({
      ...myInfo,
      status: selectedOption as MemberStatus,
    });
  }, [selectedOption]);

  return (
    <div className="w-full px-6 py-6 overflow-y-scroll rounded-lg shadow-box bg-gradient-to-tr to-light-green-linear-from from-light-green scrollbar-thin scrollbar-thumb-light-green scrollbar-track-transparent scrollbar-thumb-rounded-full">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="text-xs font-bold text-white">| 내 상태</p>
          <div className="h-fit" />
          <Dropdown
            buttonClassName="flex justify-between items-center w-[6rem] h-6 pl-5 text-white text-xxxs bg-middle-green pr-3 rounded-md"
            containerClassName="w-[6rem] bg-white rounded-b-lg overflow-hidden"
            itemClassName="w-full text-xxxs text-center font-semibold py-2 hover:bg-middle-green hover:text-white hover:font-semibold"
            iconSize="w-[12px] h-[12px]"
          />
        </div>
        <UserBlock
          imageUrl={imageUrl}
          username={username}
          status={USER_WORD_STATUS[selectedOption]}
        />
        <div className="flex justify-between text-white">
          <p className="text-xs font-bold">| 함께하는 사람들</p>
          <button
            className="text-xxs hover:underline"
            onClick={handleInviteButtonClick}
          >
            초대링크 복사
          </button>
        </div>
        {member.map((memberData: LandingMemberDTO) => (
          <UserBlock {...memberData} key={memberData.id} />
        ))}
      </div>
    </div>
  );
};

export default LandingMember;
