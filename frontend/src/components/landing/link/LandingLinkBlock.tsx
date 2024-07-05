import { LandingLinkDTO } from "../../../types/DTO/landingDTO";
import ProfileImage from "../../common/ProfileImage";
import TrashCan from "../../../assets/icons/trash-can.svg?react";
import getLinkType from "../../../utils/getLinkType";
import { LINK_LOGO_URL } from "../../../constants/landing";

interface LandingLinkBlockProps extends LandingLinkDTO {
  emitLinkDeleteEvent: ({ id }: { id: number }) => void;
}

const LandingLinkBlock = ({
  id,
  description,
  url,
  emitLinkDeleteEvent,
}: LandingLinkBlockProps) => {
  const linkLogoUrl = LINK_LOGO_URL[getLinkType(url)];

  const handleDeleteClick = () => {
    emitLinkDeleteEvent({ id });
  };

  return (
    <div className="flex items-center justify-between w-full p-3 bg-white rounded-lg group shadow-box hover:bg-light-gray">
      <a
        className="flex items-center justify-start w-full gap-4"
        href={url}
        target="_blank"
      >
        <ProfileImage imageUrl={linkLogoUrl} pxSize={40} />
        <p
          title={description}
          className="max-w-[8.5rem] overflow-hidden text-xs font-bold truncate whitespace-nowrap text-ellipsis text-dark-green"
        >
          {description}
        </p>
      </a>
      <button
        className="invisible p-1 rounded-md group-hover:visible hover:bg-white"
        type="button"
        onClick={handleDeleteClick}
      >
        <TrashCan width={24} fill="#E33535" />
      </button>
    </div>
  );
};

export default LandingLinkBlock;
