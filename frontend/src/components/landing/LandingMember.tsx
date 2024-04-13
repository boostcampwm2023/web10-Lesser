import { USER_STATUS_WORD, USER_WORD_STATUS } from "../../constants/landing";
import useDropdown from "../../hooks/common/dropdown/useDropdown";
import { LandingMemberDTO } from "../../types/DTO/landingDTO";
import UserBlock from "./UserBlock";

const LandingMember = ({
  member,
  myInfo,
}: {
  member: LandingMemberDTO[];
  myInfo: LandingMemberDTO;
}) => {
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: "내 상태",
    options: ["접속 중", "부재 중", "자리비움"],
    defaultOption: USER_STATUS_WORD[myInfo.status],
  });

  return (
    <div className="w-full shadow-box rounded-lg bg-gradient-to-tr to-light-green-linear-from from-light-green py-6 px-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-light-green scrollbar-track-transparent scrollbar-thumb-rounded-full">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="text-white text-xs font-bold">| 내 상태</p>
          <div className="h-fit" />
          <Dropdown
            buttonClassName="flex justify-between items-center w-[6rem] h-6 pl-5 text-white text-xxxs bg-middle-green pr-3 rounded-md"
            containerClassName="w-[6rem] bg-white rounded-b-lg overflow-hidden"
            itemClassName="w-full text-xxxs text-center font-semibold py-2 hover:bg-middle-green hover:text-white hover:font-semibold"
            iconSize="w-[12px] h-[12px]"
          />
        </div>
        <UserBlock
          imageUrl={myInfo.imageUrl}
          username={myInfo.username}
          status={USER_WORD_STATUS[selectedOption]}
        />
        <div className="flex justify-between text-white">
          <p className="text-xs font-bold">| 함께하는 사람들</p>
          <button className="text-xxs hover:underline">초대링크 복사</button>
        </div>
        {member.map((memberData: LandingMemberDTO) => {
          return <UserBlock {...memberData} key={memberData.id} />;
        })}
      </div>
    </div>
  );
};

export default LandingMember;
