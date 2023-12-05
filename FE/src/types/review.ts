interface Task {
  id: number;
  point: number;
  condition: string;
  memberId: number;
  completedAt: string;
  title: string;
}

interface Remi {
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
  remi: Remi;
}
