import { LINK_LOGO_URL } from "../../constants/landing";
import { LandingLinkDTO } from "../../types/DTO/landingDTO";
import getLinkType from "../../utils/getLinkType";
import ProfileImage from "../common/ProfileImage";

const LandingLinkBlock = ({ description, url }: LandingLinkDTO) => {
  const handleLinkClick = () => {
    window.open(url);
  };
  const linkLogoUrl = LINK_LOGO_URL[getLinkType(url)];
  return (
    <button
      className="w-full flex justify-start items-center gap-4 p-3 bg-white rounded-lg shadow-box hover:bg-light-gray"
      onClick={handleLinkClick}
    >
      <ProfileImage imageUrl={linkLogoUrl} pxSize={40} />
      <p className="text-dark-green text-xs font-bold truncate">
        {description}
      </p>
    </button>
  );
};

export default LandingLinkBlock;
