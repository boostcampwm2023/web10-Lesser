export interface LandingProjectDTO {
  title: string;
  subject: string;
  createdAt: string;
}

export interface LandingMemberDTO {
  username: string;
  imageUrl: string;
  status: "on" | "off" | "away";
}

export interface LandingSprintDTO {
  title: string;
  startDate: string;
  endDate: string;
  totalTask: number;
  completedTask: number;
  myTotalTask: number;
  myCompletedTask: number;
}

export interface LandingMemoDTO {
  id: number;
  head: string;
  body: string;
  author: string;
}

export interface LandingLinkDTO {
  id: number;
  description: string;
  url: string;
}

export interface LandingDTO {
  project: LandingProjectDTO;
  member: LandingMemberDTO[];
  sprint: LandingSprintDTO | null;
  board: LandingMemoDTO[];
  link: LandingLinkDTO[];
}
