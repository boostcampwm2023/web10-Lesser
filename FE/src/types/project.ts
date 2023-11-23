export interface projectCardElement {
  id: number;
  name: string;
  subject: string;
  nextPage: string;
  taskNum: number;
}

export interface projectElement extends projectCardElement {
  projectId: number;
}
