export interface ProjectUser {
  userId: number;
  userName: string;
}

export interface SelectedProjectData {
  id: number;
  userList: ProjectUser[];
}

export interface projectElement {
  id: number;
  name: string;
  subject: string;
  nextPage: string;
  myTaskCount: number;
  userList: ProjectUser[];
}
