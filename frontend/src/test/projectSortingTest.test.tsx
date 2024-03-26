import { PROJECT_SORT_OPTION } from "../constants/projects";
import { ProjectDTO } from "../types/projectDTO";
import projectSortByOption from "../utils/projectSortByOption";

const mockProjectListData: ProjectDTO[] = [
  {
    id: 1,
    title: "",
    currentSprint: {
      title: "",
      startDate: "2024-03-11T12:00:00Z",
      endDate: "",
      progressPercentage: 0,
      myTasksLeft: 0,
    },
    createdAt: "2024-03-01T12:00:00Z",
  },
  {
    id: 2,
    title: "",
    currentSprint: {
      title: "",
      startDate: "2024-03-06T12:00:00Z",
      endDate: "",
      progressPercentage: 0,
      myTasksLeft: 0,
    },
    createdAt: "2024-03-02T12:00:00Z",
  },
  {
    id: 3,
    title: "",
    currentSprint: null,
    createdAt: "2024-03-05T12:00:00Z",
  },
  {
    id: 4,
    title: "",
    currentSprint: null,
    createdAt: "2024-03-01T12:00:00Z",
  },
  {
    id: 5,
    title: "",
    currentSprint: {
      title: "",
      startDate: "2024-03-12T12:00:00Z",
      endDate: "",
      progressPercentage: 0,
      myTasksLeft: 0,
    },
    createdAt: "2024-03-10T12:00:00Z",
  },
];

describe("프로젝트 목록 정렬 함수", () => {
  const earliest = -new Date();

  it("옵션이 업데이트 순일 때", () => {
    const sortingResult = structuredClone(mockProjectListData)
      .sort((projectA, projectB) =>
        projectSortByOption({
          projectA,
          projectB,
          option: PROJECT_SORT_OPTION.UPDATE,
          earliest,
        })
      )
      .map((project) => project.id);
    expect(sortingResult).toEqual([5, 1, 2, 3, 4]);
  });

  it("옵션이 최신 순일 때", () => {
    const sortingResult = structuredClone(mockProjectListData)
      .sort((projectA, projectB) =>
        projectSortByOption({
          projectA,
          projectB,
          option: PROJECT_SORT_OPTION.RECENT,
          earliest,
        })
      )
      .map((project) => project.id);
    expect(sortingResult).toEqual([5, 3, 2, 1, 4]);
  });
});
