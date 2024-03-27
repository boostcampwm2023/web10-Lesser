import { useEffect, useMemo, useState } from "react";
import useDropdown from "../../hooks/common/dropdown/useDropdown";
import { ProjectCard } from ".";
import { PROJECT_SORT_OPTION } from "../../constants/projects";
import plus from "../../assets/icons/plus.svg";
import { ProjectDTO } from "../../types/projectDTO";
import { getProjects } from "../../apis/api/projectAPI";
import projectSortByOption from "../../utils/projectSortByOption";

const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: "",
    options: [PROJECT_SORT_OPTION.UPDATE, PROJECT_SORT_OPTION.RECENT],
    defaultOption: PROJECT_SORT_OPTION.UPDATE,
  });

  const projectList = useMemo<ProjectDTO[]>(() => {
    const earliest = -new Date();

    return structuredClone(projects).sort((projectA, projectB) =>
      projectSortByOption({
        projectA,
        projectB,
        option: selectedOption,
        earliest,
      })
    );
  }, [projects, selectedOption]);

  useEffect(() => {
    (async () => {
      const projectList = await getProjects();
      setProjects(projectList);
    })();
  }, []);

  return (
    <section className="w-[720px] min-w-[46.1rem] min-h-[40.5rem]">
      <div className="flex justify-between mb-5 w-[100%]">
        <p className="font-bold text-m text-middle-green">| 프로젝트 목록</p>
        <div className="flex items-center gap-6">
          <Dropdown
            buttonClassName="flex justify-between items-center min-w-[11.625rem] h-[2.5rem] py-2 pl-9 text-white text-xs bg-middle-green pr-3 rounded-[0.375rem] shadow-box"
            containerClassName="min-w-[11.625rem] overflow-y-auto shadow-box bg-white rounded-b-lg"
            itemClassName="text-xs font-bold py-3 px-9 hover:bg-middle-green hover:text-white hover:font-bold"
          />
          <button
            type="button"
            className="flex items-center w-[10.45rem] h-[2.5rem] py-2 pl-3 pr-9 text-white text-xs bg-middle-green gap-3 rounded-[0.375rem] shadow-box"
          >
            <img src={plus} alt="더하기" className="w-7" />
            추가하기
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-10 w-[720px] max-h-[38.75rem] overflow-y-auto scrollbar-hide">
        {projectList.map((project: ProjectDTO) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
