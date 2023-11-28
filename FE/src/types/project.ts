export interface projectCardElement {
  id: number;
  name: string;
  subject: string;
  nextPage: string;
  myTaskCount: number;
}

export interface projectElement extends projectCardElement {
  projectId: number;
}
