import { LandingLinkDTO } from "../../../types/DTO/landingDTO";
import ProfileImage from "../../common/ProfileImage";
import TrashCan from "../../../assets/icons/trash-can.svg?react";

interface LandingLinkBlockProps extends LandingLinkDTO {
  emitLinkDeleteEvent: ({ id }: { id: number }) => void;
}

const LandingLinkBlock = ({
  id,
  description,
  url,
  emitLinkDeleteEvent,
}: LandingLinkBlockProps) => {
  const linkLogoUrl = `${new URL(url).origin}/favicon.ico`;

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
        <p className="text-xs font-bold truncate text-dark-green">
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
