import { Socket } from "socket.io-client";
import { LandingDTO, LandingProjectDTO } from "../../../types/DTO/landingDTO";
import { useEffect, useState } from "react";
import { DEFAULT_VALUE } from "../../../constants/landing";
import {
  LandingSocketData,
  LandingSocketDomain,
} from "../../../types/common/landing";
import {
  SettingSocketData,
  SettingSocketDomain,
} from "../../../types/common/setting";
import { SettingProjectDTO } from "../../../types/DTO/settingDTO";

const useLandingProjectSocket = (socket: Socket) => {
  const [project, setProject] = useState<LandingProjectDTO>(
    DEFAULT_VALUE.PROJECT
  );

  const handleInitEvent = (content: LandingDTO) => {
    const { project } = content as LandingDTO;
    setProject(project);
  };

  const handleProjectInfoEvent = (content: SettingProjectDTO) => {
    setProject({ ...project, title: content.title, subject: content.subject });
  };

  const handleOnLanding = ({
    domain,
    content,
  }: LandingSocketData | SettingSocketData) => {
    if (domain === SettingSocketDomain.PROJECT_INFO) {
      handleProjectInfoEvent(content);
    }

    if (domain === LandingSocketDomain.INIT) {
      handleInitEvent(content);
      return;
    }
  };

  useEffect(() => {
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing", handleOnLanding);
    };
  }, []);
  return { project };
};

export default useLandingProjectSocket;
