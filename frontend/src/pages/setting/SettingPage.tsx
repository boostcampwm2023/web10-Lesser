import InformationSettingSection from "../../components/setting/InformationSettingSection";
import MemberSettingSection from "../../components/setting/MemberSettingSection";
import ProjectDeleteSection from "../../components/setting/ProjectDeleteSection";
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
    <ProjectDeleteSection projectTitle="프로젝트 이름" />
  </div>
);

export default SettingPage;
