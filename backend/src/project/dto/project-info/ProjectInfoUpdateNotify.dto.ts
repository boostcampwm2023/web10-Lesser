class projectInfo {
  title: string;
  subject: string;
}

export class ProjectInfoUpdateNotifyDto {
  domain: string;
  action: string;
  content: projectInfo;

  static of(title: string, subject: string) {
    const dto = new ProjectInfoUpdateNotifyDto();
    dto.domain = 'projectInfo';
    dto.action = 'update';
    dto.content = {
      title,
      subject,
    };
    return dto;
  }
}
