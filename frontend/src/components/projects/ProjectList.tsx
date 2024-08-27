import { useMemo } from "react";
import { Link } from "react-router-dom";
import useDropdown from "../../hooks/common/dropdown/useDropdown";
import { ProjectCard } from ".";
import { PROJECT_SORT_OPTION } from "../../constants/projects";
import plus from "../../assets/icons/plus.svg";
import { ProjectDTO } from "../../types/DTO/projectDTO";
import projectSortByOption from "../../utils/projectSortByOption";
import { useGetProjects } from "../../hooks/queries/project";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../constants/path";

const ProjectList = () => {
  const { data: projects, error } = useGetProjects();
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: "",
    options: [PROJECT_SORT_OPTION.UPDATE, PROJECT_SORT_OPTION.RECENT],
    defaultOption: PROJECT_SORT_OPTION.UPDATE,
  });
  const navigate = useNavigate();

  const handleCreateButtonClick = () => {
    navigate(`/${ROUTER_URL.PROJECTS_CREATE}`);
  };

  const projectList = useMemo<ProjectDTO[]>(() => {
    const earliest = -new Date();

    if (Array.isArray(projects)) {
      return structuredClone(projects).sort((projectA, projectB) =>
        projectSortByOption({
          projectA,
          projectB,
          option: selectedOption,
          earliest,
        })
      );
    }

    return [];
  }, [projects, selectedOption]);

  if (error) {
    throw error;
  }

  return (
    <section className="min-w-[720px] min-h-[40.5rem] flex flex-col gap-6">
      <div className="flex justify-between w-[100%]">
        <p className="font-bold text-m text-middle-green">| 프로젝트 목록</p>
        <div className="flex items-center gap-6">
          <Dropdown
            buttonClassName="flex justify-between items-center min-w-[11.625rem] h-[2.5rem] py-2 pl-9 text-white text-xs bg-middle-green pr-3 rounded-[0.375rem] shadow-box"
            containerClassName="min-w-[11.625rem] overflow-y-auto shadow-box bg-white rounded-b-lg"
            itemClassName="text-xs font-bold py-3 px-9 hover:bg-middle-green hover:text-white hover:font-bold"
          />
          <button
            type="button"
            className="flex items-center justify-center w-[10.45rem] h-[2.5rem] py-2 pl-3 pr-9 text-white text-xs bg-middle-green gap-3 rounded-[0.375rem] shadow-box"
            onClick={handleCreateButtonClick}
          >
            <img src={plus} alt="더하기" className="w-7" />
            추가하기
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-10 w-[720px] max-h-[37.25rem] overflow-y-auto scrollbar-hide">
        {projectList.length ? (
          projectList.map((project: ProjectDTO) => (
            <Link key={project.id} to={`${ROUTER_URL.PROJECTS}/${project.id}`}>
              <ProjectCard project={project} />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center w-full gap-1 py-6 text-xs bg-gray-100 rounded-md">
            <p>진행 중인 프로젝트가 없습니다.</p>
            <p>프로젝트를 추가해주세요.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectList;
