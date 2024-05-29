import { Member } from 'src/member/entity/member.entity';
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

class MemberInfo {
  id: number;
  username: string;
  imageUrl: string;
  status: string;
  static of(member: Member, status: string) {
    const newMemberInfo = new MemberInfo();
    newMemberInfo.id = member.id;
    newMemberInfo.username = member.username;
    newMemberInfo.imageUrl = member.github_image_url;
    newMemberInfo.status = status;
    return newMemberInfo;
  }
}

class ProjectLandingPageContentDto {
  project: ProjectDto;
  myInfo: MemberInfo;
  member: MemberInfo[];
  sprint: null;
  memoList: MemoDto[];
  link: [];
  inviteLinkId: string;
  static of(
    project: Project,
    myInfo: Member,
    projectMemberList: Member[],
    memoListWithMember: Memo[],
  ) {
    const dto = new ProjectLandingPageContentDto();
    dto.project = ProjectDto.of(project);
    dto.myInfo = MemberInfo.of(myInfo, 'off');
    dto.member = projectMemberList
      .filter((member) => member.id !== myInfo.id)
      .map((member) => MemberInfo.of(member, 'off'));
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

  static of(
    project: Project,
    myInfo: Member,
    projectMemberList: Member[],
    memoListWithMember: Memo[],
  ) {
    const dto = new InitLandingResponseDto();
    dto.domain = 'landing';
    dto.action = 'init';
    dto.content = ProjectLandingPageContentDto.of(
      project,
      myInfo,
      projectMemberList,
      memoListWithMember,
    );
    return dto;
  }
}
