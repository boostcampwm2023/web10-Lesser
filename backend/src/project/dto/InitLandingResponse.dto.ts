import { Memo, memoColor } from '../entity/memo.entity';
import { Project } from '../entity/project.entity';

class MemoDto {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  color: memoColor;

  static of(memoWithMember: Memo) {
    const dto = new MemoDto();
    dto.id = memoWithMember.id;
    dto.title = memoWithMember.title;
    dto.content = memoWithMember.content;
    dto.author = memoWithMember.member.username;
    dto.createdAt = memoWithMember.created_at;
    dto.color = memoWithMember.color;
    return dto;
  }
}

class ProjectDto {
  title: string;
  subject: string;
  createdAt: Date;
  static of(project: Project) {
    const dto = new ProjectDto();
    dto.title = project.title;
    dto.subject = project.subject;
    dto.createdAt = project.created_at;
    return dto;
  }
}

class ProjectLandingPageContentDto {
  project: ProjectDto;
  myInfo: {};
  member: [];
  sprint: null;
  memoList: MemoDto[];
  link: [];
  inviteLinkId: string;
  static of(project: Project, memoListWithMember: Memo[]) {
    const dto = new ProjectLandingPageContentDto();
    dto.project = ProjectDto.of(project);
    dto.myInfo = {};
    dto.member = [];
    dto.sprint = null;
    const memoList = memoListWithMember.map((memo) => MemoDto.of(memo));
    dto.memoList = memoList;
    dto.link = [];
    dto.inviteLinkId = project.inviteLinkId;
    return dto;
  }
}

export class InitLandingResponseDto {
  domain: string;
  action: string;
  content: ProjectLandingPageContentDto;

  static of(project: Project, memoListWithMember: Memo[]) {
    const dto = new InitLandingResponseDto();
    dto.domain = 'landing';
    dto.action = 'init';
    dto.content = ProjectLandingPageContentDto.of(project, memoListWithMember);
    return dto;
  }
}
