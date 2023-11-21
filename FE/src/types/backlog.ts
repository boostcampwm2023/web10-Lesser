export interface TaskData {
  title: string;
  member: string;
  point: number;
  completionCondition: string;
}

export interface BacklogState {
  epics: {
    title: string;
    stories: {
      title: string;
      tasks: TaskData[];
    }[];
  }[];
}
