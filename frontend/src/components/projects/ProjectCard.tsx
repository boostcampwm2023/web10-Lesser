import { ProjectDTO } from "../../types/projectDTO";
import formatDate from "../../utils/formatDate";

interface ProjectCardProps {
  project: ProjectDTO;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, currentSprint } = project;
  return (
    <div className="w-[21.25rem] p-9 bg-gradient-to-bl from-white-transparent to-95% bg-middle-green">
      <p className="mb-[1.125rem] text-xl font-bold text-white">{title}</p>
      <div className="h-[3.9rem]">
        <p className="mb-2.5 text-xs font-bold text-white">
          {currentSprint && currentSprint.title}
        </p>
        <p className="text-xs text-white">
          {currentSprint &&
            `${formatDate(currentSprint.startDate)} - ${formatDate(
              currentSprint.endDate
            )}`}
        </p>
      </div>
      <div className="flex items-center min-h-[7.625rem] mt-[1.125rem] px-9 py-6 gap-12 bg-white">
        {currentSprint ? (
          <>
            <div className="flex flex-col items-center gap-3 font-bold text-middle-green">
              <p className="text-m">
                <span className="text-[2.25rem]">
                  {currentSprint.progressPercentage.toString().padStart(2, '0')}
                </span>%
              </p>
              <p>진행률</p>
            </div>
            <div className="flex flex-col items-center gap-3 font-bold text-middle-green">
              <p className="text-m">
                <span className="text-[2.25rem]">
                  {currentSprint.myTasksLeft.toString().padStart(2, '0')}
                </span>건
              </p>
              <p>내 업무</p>
            </div>
          </>
        ) : (
          <div className="flex-col items-center h-[4.875rem]">
            <p>진행중인 스프린트가</p>
            <p>없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
