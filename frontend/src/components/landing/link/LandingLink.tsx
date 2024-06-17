import { useModal } from "../../../hooks/common/modal/useModal";
import { LandingLinkDTO } from "../../../types/DTO/landingDTO";
import LandingLinkBlock from "./LandingLinkBlock";
import LandingLinkModal from "./LandingLinkModal";
import LandingTitleUI from "../common/LandingTitleUI";
import { Socket } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import useLandingLinkSocket from "../../../hooks/common/landing/useLandingLinkSocket";

const LandingLink = () => {
  const { socket }: { socket: Socket } = useOutletContext();
  const { link, emitLinkCreateEvent } = useLandingLinkSocket(socket);

  const { open, close } = useModal(true);
  const handleCreateLinkClick = () => {
    open(<LandingLinkModal {...{ close, emitLinkCreateEvent }} />);
  };

  return (
    <div className="flex flex-col w-full pt-6 pl-6 pr-3 rounded-lg shadow-box bg-gradient-to-tr to-middle-green-linear-from from-middle-green">
      <LandingTitleUI title={"외부 링크"} handleClick={handleCreateLinkClick} />
      <div className="flex flex-col gap-3 py-6 pr-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-dark-green scrollbar-track-transparent">
        {link.map((linkData: LandingLinkDTO) => (
          <LandingLinkBlock {...linkData} key={linkData.id} />
        ))}
      </div>
    </div>
  );
};

export default LandingLink;
