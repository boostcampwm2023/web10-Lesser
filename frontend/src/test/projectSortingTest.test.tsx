import { PROJECT_LIST_OPTION } from "../constants/projects";

interface Project {
  id: number;
  currentSprint?: { startDate: string };
  createdAt: string;
}
const mockProjectListData: Project[] = [
  {
    id: 1,
    currentSprint: { startDate: "2024-03-11T12:00:00Z" },
    createdAt: "2024-03-01T12:00:00Z",
  },
  {
    id: 2,
    currentSprint: { startDate: "2024-03-06T12:00:00Z" },
    createdAt: "2024-03-02T12:00:00Z",
  },
  {
    id: 3,
    createdAt: "2024-03-05T12:00:00Z",
  },
  {
    id: 4,
    createdAt: "2024-03-01T12:00:00Z",
  },
  {
    id: 5,
    currentSprint: { startDate: "2024-03-12T12:00:00Z" },
    createdAt: "2024-03-10T12:00:00Z",
  },
];

describe("프로젝트 목록 정렬 함수", () => {
  let selectedOption: string;
  const now = -new Date();
  const sortingFunction = (a: Project, b: Project) => {
    if (selectedOption === PROJECT_LIST_OPTION[0]) {
      const aStartDate = a.currentSprint
        ? new Date(a.currentSprint?.startDate)
        : now;
      const bStartDate = b.currentSprint
        ? new Date(b.currentSprint?.startDate)
        : now;

      if (aStartDate === bStartDate) {
        return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
      }

      return Number(bStartDate) - Number(aStartDate);
    } else {
      return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
    }
  };

  it("옵션이 업데이트 순일 때", () => {
    [selectedOption] = PROJECT_LIST_OPTION;
    const sortingResult = structuredClone(mockProjectListData)
      .sort(sortingFunction)
      .map((project) => project.id);
    expect(sortingResult).toEqual([5, 1, 2, 3, 4]);
  });

  it("옵션이 최신 순일 때", () => {
    [, selectedOption] = PROJECT_LIST_OPTION;
    const sortingResult = structuredClone(mockProjectListData)
      .sort(sortingFunction)
      .map((project) => project.id);
    expect(sortingResult).toEqual([5, 3, 2, 1, 4]);
  });
});
