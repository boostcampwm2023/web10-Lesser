import JoinRequestBlock from "./JoinRequestBlock";
import MemberBlock from "./MemberBlock";
import {
  SettingJoinRequestDTO,
  SettingMemberDTO,
} from "../../types/DTO/settingDTO";

interface MemberSettingSectionProps {
  memberList: SettingMemberDTO[];
  joinRequestList: SettingJoinRequestDTO[];
}

const MemberSettingSection = ({
  memberList,
  joinRequestList,
}: MemberSettingSectionProps) => (
  <div className="mb-5">
    <div className="mb-2">
      <p className="font-bold text-m text-middle-green">멤버 관리</p>
    </div>
    <div className="flex flex-col gap-2 h-[18.52rem]">
      <div className="flex w-full gap-3 border-b-[2px] text-[1rem] text-dark-gray">
        <p className="w-[16.25rem]">닉네임</p>
        <p className="w-[18.75rem]">역할</p>
        <p className="w-[30rem]">작업</p>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto scrollbar-thin">
        {...memberList.map((member) => <MemberBlock {...member} />)}
        {...joinRequestList.map((request) => <JoinRequestBlock {...request} />)}
      </div>
    </div>
  </div>
);

export default MemberSettingSection;
