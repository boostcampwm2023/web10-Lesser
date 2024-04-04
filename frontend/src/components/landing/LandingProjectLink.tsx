import { Link } from "react-router-dom";
import { LANDING_PROJECT_LINK } from "../../constants/landing";
import { LINK_URL } from "../../constants/path";

interface LandingProjectLinkProps {
  projectId: string;
  type: "BACKLOG" | "SPRINT" | "SETTINGS";
}

const LandingProjectLink = ({ projectId, type }: LandingProjectLinkProps) => {
  const { color, text, Icon } = LANDING_PROJECT_LINK[type];
  return (
    <Link
      to={LINK_URL.BACKLOG(projectId)}
      className={`w-[8.75rem] h-[5rem] rounded-lg flex justify-center gap-2 items-center ${color} hover:shadow-button`}
    >
      <Icon height={36} width={36} fill="#FFFFFF" />
      <div className="flex flex-col items-center gap-0 text-white text-[1rem] font-semibold">
        <p>{text}</p>
        <p>바로가기</p>
      </div>
    </Link>
  );
};

export default LandingProjectLink;
