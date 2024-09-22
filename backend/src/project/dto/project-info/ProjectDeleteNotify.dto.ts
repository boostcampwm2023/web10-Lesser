export class ProjectDeleteNotifyDto {
  domain: string;
  action: string;
  content: Record<string, string>;

  static of() {
    const dto = new ProjectDeleteNotifyDto();
    dto.domain = 'projectInfo';
    dto.action = 'delete';
    dto.content = {};
    return dto;
  }
}
