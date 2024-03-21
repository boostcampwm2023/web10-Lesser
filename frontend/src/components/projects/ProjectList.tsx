import { useMemo, useState } from "react";
import useDropdown from "../../hooks/common/dropdown/useDropdown";
import { ProjectCard } from ".";
import { PROJECT_LIST_OPTION } from "../../constants/projects";
import plus from "../../assets/icons/plus.svg";
import { ProjectDTO } from "../../types/projectDTO";

const ProjectList = () => {
  const [projects] = useState<ProjectDTO[]>([]);
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: "업데이트 순",
    options: PROJECT_LIST_OPTION,
  });

  const projectList = useMemo<ProjectDTO[]>(
    () =>
      structuredClone(projects).sort((a, b) => {
        if (selectedOption === PROJECT_LIST_OPTION[0]) {
          const aStartDate = a.currentSprint
            ? new Date(a.currentSprint?.startDate)
            : new Date();
          const bStartDate = b.currentSprint
            ? new Date(b.currentSprint?.startDate)
            : new Date();

          return Number(aStartDate) - Number(bStartDate);
        } else {
          return Number(new Date(a.createdAt)) - Number(new Date(b.createdAt));
        }
      }),
    [projects, selectedOption]
  );

  return (
    <section className="w-[75rem] min-h-[40.5rem]">
      <div className="flex justify-between">
        <p className="font-bold text-m text-middle-green">| 프로젝트 목록</p>
        <div className="flex items-center gap-6">
          <Dropdown buttonClassName="flex items-center w-[10rem] h-[2.5rem] py-2 pl-9 text-white text-xs bg-middle-green pr-3 rounded-[0.375rem] shadow-box" />
          <button
            type="button"
            className="flex items-center w-[10rem] h-[2.5rem] py-2 pl-3 pr-9 text-white text-xs bg-middle-green gap-3 rounded-[0.375rem] shadow-box"
          >
            <img src={plus} alt="더하기" className="w-7" />
            추가하기
          </button>
        </div>
      </div>
      <div className="">
        {projectList.map((project: ProjectDTO) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
