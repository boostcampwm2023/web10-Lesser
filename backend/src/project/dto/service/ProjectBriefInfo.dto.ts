export class ProjectBriefInfoDto {
  id: number;
  title: string;
  subject: string;
  leaderUsername: string;

  static of(
    id: number,
    title: string,
    subject: string,
    leaderUsername: string,
  ) {
    const dto = new ProjectBriefInfoDto();
    dto.id = id;
    dto.title = title;
    dto.subject = subject;
    dto.leaderUsername = leaderUsername;
    return dto;
  }
}
