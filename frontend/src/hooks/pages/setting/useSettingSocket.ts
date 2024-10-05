import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  SettingSocketData,
  SettingSocketDomain,
  SettingSocketProjectInfoAction,
} from "../../../types/common/setting";
import {
  SettingDTO,
  SettingJoinRequestDTO,
  SettingMemberDTO,
  SettingProjectDTO,
} from "../../../types/DTO/settingDTO";

const useSettingSocket = (socket: Socket) => {
  const [projectInfo, setProjectInfo] = useState<SettingProjectDTO>({
    title: "",
    subject: "",
  });
  const [memberList, setMemberList] = useState<SettingMemberDTO[]>([]);
  const [joinRequestList, setJoinRequestList] = useState<
    SettingJoinRequestDTO[]
  >([]);

  const handleInitEvent = (content: SettingDTO) => {
    const { project, member, joinRequestList } = content;
    setProjectInfo(project);
    setMemberList(member);
    setJoinRequestList(joinRequestList ? joinRequestList : []);
  };

  const handleProjectInfoEvent = (
    action: SettingSocketProjectInfoAction,
    content: SettingProjectDTO
  ) => {
    switch (action) {
      case SettingSocketProjectInfoAction.UPDATE:
        setProjectInfo(content);
        break;
    }
  };

  const handleOnProjectInfoSetting = ({
    domain,
    action,
    content,
  }: SettingSocketData) => {
    switch (domain) {
      case SettingSocketDomain.INIT:
        handleInitEvent(content);
        break;
      case SettingSocketDomain.PROJECT_INFO:
        handleProjectInfoEvent(action, content);
        break;
    }
  };

  useEffect(() => {
    socket.emit("joinSetting");
    socket.on("setting", handleOnProjectInfoSetting);

    return () => {
      socket.off("setting", handleOnProjectInfoSetting);
    };
  }, []);

  return { projectInfo, memberList, joinRequestList };
};

export default useSettingSocket;
