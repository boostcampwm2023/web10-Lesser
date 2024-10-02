import { Socket } from "socket.io-client";
import InformationSettingSection from "../../components/setting/InformationSettingSection";
import MemberSettingSection from "../../components/setting/MemberSettingSection";
import ProjectDeleteSection from "../../components/setting/ProjectDeleteSection";
import { useOutletContext } from "react-router-dom";
import useSettingSocket from "../../hooks/pages/setting/useSettingSocket";

const SettingPage = () => {
  const { socket }: { socket: Socket } = useOutletContext();
  const {
    projectInfo: { title, subject },
    memberList,
    joinRequestList,
  } = useSettingSocket(socket);

  return (
    <div className="w-full h-full">
      <InformationSettingSection {...{ title, subject }} />
      <MemberSettingSection {...{ joinRequestList, memberList }} />
      <ProjectDeleteSection projectTitle={title} />
    </div>
  );
};

export default SettingPage;
