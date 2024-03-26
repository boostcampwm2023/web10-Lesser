export interface ProjectDTO {
  id: number;
  title: string;
  createdAt: string;
  currentSprint: null | {
    title: string;
    startDate: string;
    endDate: string;
    progressPercentage: number;
    myTasksLeft: number;
  };
}
