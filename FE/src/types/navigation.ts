export interface NavigationInformation {
  pageName: string;
  description?: string;
  pageURI: (projectId: number) => string;
}
