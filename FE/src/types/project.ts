export interface projectCardElement {
  title: string;
  description: string;
  taskNum: number;
}

export interface projectElement extends projectCardElement {
  projectId: number;
}
