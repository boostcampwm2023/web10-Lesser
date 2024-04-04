import { PROJECT_SORT_OPTION } from "../constants/projects";
import { ProjectDTO } from "../types/DTO/projectDTO";

interface ProjectSortByOptionParams {
  projectA: ProjectDTO;
  projectB: ProjectDTO;
  option: string;
  earliest: number;
}

const projectSortByOption = ({
  projectA,
  projectB,
  option,
  earliest,
}: ProjectSortByOptionParams) => {
  if (option === PROJECT_SORT_OPTION.UPDATE) {
    const projectASprintStart = projectA.currentSprint
      ? new Date(projectA.currentSprint?.startDate)
      : earliest;
    const projectBSprintStart = projectB.currentSprint
      ? new Date(projectB.currentSprint?.startDate)
      : earliest;

    if (projectASprintStart === projectBSprintStart) {
      return Number(new Date(projectB.createdAt)) - Number(new Date(projectA.createdAt));
    }

    return Number(projectBSprintStart) - Number(projectASprintStart);
  } else {
    return Number(new Date(projectB.createdAt)) - Number(new Date(projectA.createdAt));
  }
};

export default projectSortByOption;
