import { Socket } from "socket.io-client";
import InformationSettingSection from "../../components/setting/InformationSettingSection";
import MemberSettingSection from "../../components/setting/MemberSettingSection";
import ProjectDeleteSection from "../../components/setting/ProjectDeleteSection";
import { LandingMemberDTO } from "../../types/DTO/landingDTO";
import { useOutletContext } from "react-router-dom";
import useSettingSocket from "../../hooks/pages/setting/useSettingSocket";

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

const SettingPage = () => {
  const { socket }: { socket: Socket } = useOutletContext();
  const {
    projectInfo: { title, subject },
  } = useSettingSocket(socket);

  return (
    <div className="w-full h-full">
      <InformationSettingSection {...{ title, subject }} />
      <MemberSettingSection memberList={memberList} />
      <ProjectDeleteSection projectTitle={title} />
    </div>
  );
};

export default SettingPage;
