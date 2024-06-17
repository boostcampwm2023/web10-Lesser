import { LandingLinkDTO } from "../../../types/DTO/landingDTO";
import ProfileImage from "../../common/ProfileImage";

const LandingLinkBlock = ({ description, url }: LandingLinkDTO) => {
  const linkLogoUrl = `${new URL(url).origin}/favicon.ico`;
  return (
    <a
      className="flex items-center justify-start w-full gap-4 p-3 bg-white rounded-lg shadow-box hover:bg-light-gray"
      href={url}
      target="_blank"
    >
      <ProfileImage imageUrl={linkLogoUrl} pxSize={40} />
      <p className="text-xs font-bold truncate text-dark-green">
        {description}
      </p>
    </a>
  );
};

export default LandingLinkBlock;
