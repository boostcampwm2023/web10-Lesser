import { LandingMemberDTO } from "../../types/DTO/landingDTO";
import MemberBlock from "./MemberBlock";

interface MemberSettingSectionProps {
  memberList: LandingMemberDTO[];
}

const MemberSettingSection = ({ memberList }: MemberSettingSectionProps) => (
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
      <div className="overflow-y-auto scrollbar-thin">
        {...memberList.map((member) => <MemberBlock {...member} />)}
      </div>
    </div>
  </div>
);

export default MemberSettingSection;
