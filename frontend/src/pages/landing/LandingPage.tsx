import { useOutletContext, useParams } from "react-router-dom";
import LandingProject from "../../components/landing/LandingProject";
import LandingSprint from "../../components/landing/LandingSprint";
import LandingMember from "../../components/landing/LandingMember";
import LandingLink from "../../components/landing/LandingLink";
import { Socket } from "socket.io-client";
import useLandingSocket from "../../hooks/common/socket/useLandingSocket";
import LandingTitleUI from "../../components/landing/LandingTitleUI";

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
        <div className="w-full rounded-lg shadow-box bg-gradient-to-tr from-dark-green-linear-from to-dark-green-linear-to">
          <div className="py-6 ps-6 pe-3 w-[32rem]">
            <LandingTitleUI
              title={"프로젝트 메모"}
              handleClick={() => {
                console.log("hello");
              }}
            />
            <div className="mt-2 flex flex-wrap w-full h-[12rem] gap-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-dark-green scrollbar-track-transparent scrollbar-thumb-rounded-full">
              <div className="w-[13.75rem] h-[9.375rem] flex flex-col px-4 py-3 gap-2 bg-[#FFD966]">
                <input
                  placeholder="제목을 작성하세요"
                  className="text-xs font-bold bg-transparent focus:outline-none"
                />
                <textarea
                  placeholder="내용을 작성하세요"
                  className="text-xxs bg-transparent focus:outline-none h-full resize-none"
                  spellCheck="false"
                />
                <p className="text-xxxs font-bold">김용현</p>
              </div>
            </div>
          </div>
        </div>
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
