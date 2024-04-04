import { LandingProjectDTO } from "../../types/DTO/landingDTO";
import formatDate from "../../utils/formatDate";
import LandingProjectLink from "./LandingProjectLink";

interface LandingProjectProps {
  project: LandingProjectDTO;
  projectId: string;
}

const LandingProject = ({ project, projectId }: LandingProjectProps) => {
  return (
    <div className="border w-full p-6 flex flex-col justify-between shadow-box rounded-lg">
      <div className="flex justify-between items-baseline text-middle-green font-bold">
        <p className="text-xl">| {project.title}</p>
        <p className="text-xs">{formatDate(project.createdAt)}</p>
      </div>
      <div className="text-xs">{project.subject}</div>
      <div className="flex justify-between">
        <LandingProjectLink projectId={projectId} type="BACKLOG" />
        <LandingProjectLink projectId={projectId} type="SPRINT" />
        <LandingProjectLink projectId={projectId} type="SETTINGS" />
      </div>
    </div>
  );
};

export default LandingProject;
