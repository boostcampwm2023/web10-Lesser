import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  SettingSocketData,
  SettingSocketDomain,
  SettingSocketProjectInfoAction,
} from "../../../types/common/setting";
import { SettingDTO, SettingProjectDTO } from "../../../types/DTO/settingDTO";

const useSettingSocket = (socket: Socket) => {
  const [projectInfo, setProjectInfo] = useState<SettingProjectDTO>({
    title: "",
    subject: "",
  });

  const handleInitEvent = (content: SettingDTO) => {
    const { project } = content;
    setProjectInfo(project);
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

  return { projectInfo };
};

export default useSettingSocket;
