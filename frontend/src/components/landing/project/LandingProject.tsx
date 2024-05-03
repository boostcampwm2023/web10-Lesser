import { LandingProjectDTO } from "../../../types/DTO/landingDTO";
import formatDate from "../../../utils/formatDate";
import LandingProjectLink from "./LandingProjectLink";

interface LandingProjectProps {
  project: LandingProjectDTO;
  projectId: string;
}

const LandingProject = ({ project, projectId }: LandingProjectProps) => (
  <div className="flex flex-col justify-between w-full p-6 rounded-lg shadow-box">
    <div className="flex items-baseline justify-between font-bold text-middle-green">
      <p className="text-xl">| {project.title}</p>
      <p className="text-xs">
        {project.createdAt && formatDate(project.createdAt)}
      </p>
    </div>
    <div className="text-xs">{project.subject}</div>
    <div className="flex justify-between">
      <LandingProjectLink projectId={projectId} type="BACKLOG" />
      <LandingProjectLink projectId={projectId} type="SPRINT" />
      <LandingProjectLink projectId={projectId} type="SETTINGS" />
    </div>
  </div>
);

export default LandingProject;
