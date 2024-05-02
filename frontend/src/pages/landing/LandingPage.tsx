import { useOutletContext, useParams } from "react-router-dom";
import LandingProject from "../../components/landing/LandingProject";
import LandingSprint from "../../components/landing/LandingSprint";
import LandingMember from "../../components/landing/LandingMember";
import LandingLink from "../../components/landing/LandingLink";
import { Socket } from "socket.io-client";
import useLandingSocket from "../../hooks/common/socket/useLandingSocket";

const LandingPage = () => {
  const { projectId } = useParams();
  if (!projectId) {
    throw Error("Invalid Web URL");
  }

  const { socket }: { socket: Socket } = useOutletContext();

  const { project, myInfo, member, sprint, link, inviteLinkIdRef } =
    useLandingSocket(socket);

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div className="h-[17.6875rem] w-full shrink-0 flex gap-9">
        <LandingProject {...{ project, projectId }} />
        <div className="w-full rounded-lg shadow-box bg-gradient-to-tr from-dark-green-linear-from to-dark-green-linear-to"></div>
      </div>
      <div className="h-[20.5625rem] w-full shrink-0 flex gap-9">
        <LandingSprint {...{ sprint }} />
        <LandingMember
          {...{ member, myInfo, inviteLinkIdRef }}
          projectTitle={project.title}
        />
        <LandingLink {...{ link }} />
      </div>
    </div>
  );
};

export default LandingPage;
