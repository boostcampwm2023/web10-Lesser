import InformationSettingSection from "../../components/setting/InformationSettingSection";
import MemberSettingSection from "../../components/setting/MemberSettingSection";
import { LandingMemberDTO } from "../../types/DTO/landingDTO";

const memberList: LandingMemberDTO[] = [
  { id: 1, username: "lesserTest", role: "LEADER", imageUrl: "", status: "on" },
  {
    id: 2,
    username: "lesserTest2",
    role: "MEMBER",
    imageUrl: "",
    status: "on",
  },
  {
    id: 3,
    username: "lesserTest3",
    role: "MEMBER",
    imageUrl: "",
    status: "on",
  },
];

const SettingPage = () => (
  <div className="w-full h-full">
    <InformationSettingSection title="프로젝트 이름" subject="프로젝트 주제" />
    <MemberSettingSection memberList={memberList} />
    <div className="flex items-center justify-between">
      <div className="">
        <p className="text-xs">프로젝트 삭제</p>
        <p className="text-xxs">프로젝트를 삭제한 후 되돌릴 수 없습니다.</p>
      </div>
      <button
        className="h-10 px-2 font-light text-white rounded-lg w-fit bg-error-red text-xxs"
        type="button"
      >
        프로젝트 삭제
      </button>
    </div>
  </div>
);

export default SettingPage;
