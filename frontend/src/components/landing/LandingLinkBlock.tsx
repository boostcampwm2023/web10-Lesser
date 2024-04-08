import { LINK_LOGO_URL } from "../../constants/landing";
import { LandingLinkDTO } from "../../types/DTO/landingDTO";
import getLinkType from "../../utils/getLinkType";
import ProfileImage from "../common/ProfileImage";

const LandingLinkBlock = ({ description, url }: LandingLinkDTO) => {
  const linkLogoUrl = LINK_LOGO_URL[getLinkType(url)];
  return (
    <a
      className="w-full flex justify-start items-center gap-4 p-3 bg-white rounded-lg shadow-box hover:bg-light-gray"
      href={url}
      target="_blank"
    >
      <ProfileImage imageUrl={linkLogoUrl} pxSize={40} />
      <p className="text-dark-green text-xs font-bold truncate">
        {description}
      </p>
    </a>
  );
};

export default LandingLinkBlock;
