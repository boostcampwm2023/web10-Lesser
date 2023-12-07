interface Task {
  id: number;
  point: number;
  condition: string;
  userId: string;
  completedAt: string;
  title: string;
  sequence: number;
}

interface Reminiscing {
  id: number;
  content: string;
}

export interface Sprint {
  sprintId: number;
  title: string;
}

export interface SelectedSprint {
  id: number;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
  closedDate: string;
  completedCount: number;
  incompleteCount: number;
  taskList: Task[];
  reminiscing: Reminiscing;
}

export interface Data {
  sprintList: Sprint[];
  selectedSprint: SelectedSprint;
}
