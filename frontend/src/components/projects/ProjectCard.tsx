import { ProjectDTO } from "../../types/projectDTO";

interface ProjectCardProps {
  project: ProjectDTO;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, currentSprint } = project;
  return (
    <div className="w-[21.25rem] p-9 bg-gradient-to-bl from-white-transparent to-90% bg-light-green shadow-box">
      <p className="mb-[1.125rem] text-xl font-bold text-white">{title}</p>
      <p className="mb-2.5 text-xs font-bold text-white">
        {currentSprint && currentSprint.title}
      </p>
      <p className="text-xs text-white">
        {currentSprint &&
          `${currentSprint.startDate} - ${currentSprint.endDate}`}
      </p>
      <div className="flex items-center mt-[1.125rem] px-9 py-6 gap-12 bg-white">
        {currentSprint ? (
          <>
            <div className="flex-col items-center gap-3 font-bold text-middle-green">
              <p className="text-m">
                <span className="text-[2.25rem]">
                  {currentSprint.progressPercentage}
                </span>{" "}
                %
              </p>
              <p className="">진행률</p>
            </div>
            <div className="flex-col items-center gap-3 font-bold text-middle-green">
              <p className="text-m">
                <span className="text-[2.25rem]">
                  {currentSprint.myTasksLeft}
                </span>{" "}
                건
              </p>
              <p className="">내 업무</p>
            </div>
          </>
        ) : (
          <p>진행중인 스프린트가 없습니다</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
