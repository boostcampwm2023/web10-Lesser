import { Member } from 'src/member/entity/member.entity';
import { ProjectJoinRequest } from 'src/project/entity/project-join-request.entity';
import { Project } from 'src/project/entity/project.entity';
import { MemberRole } from 'src/project/enum/MemberRole.enum';

class ProjectMemberDto {
  id: number;
  username: string;
  imageUrl: string;
  role: MemberRole;

  static of(member: Member): ProjectMemberDto {
    const dto = new ProjectMemberDto();
    dto.id = member.id;
    dto.username = member.username;
    dto.imageUrl = member.github_image_url;
    dto.role = member.projectToMember[0].role;
    return dto;
  }
}

class ProjectDto {
  title: string;
  subject: string;

  static of(project: Project): ProjectDto {
    const dto = new ProjectDto();
    dto.title = project.title;
    dto.subject = project.subject;
    return dto;
  }
}

class JoinRequestListDto {
  id: number;
  memberId: number;
  username: string;
  imageUrl: string;

  static of(projectJoinRequest: ProjectJoinRequest): JoinRequestListDto {
    const dto = new JoinRequestListDto();
    dto.id = projectJoinRequest.id;
    dto.memberId = projectJoinRequest.memberId;
    dto.username = projectJoinRequest.member.username;
    dto.imageUrl = projectJoinRequest.member.github_image_url;
    return dto;
  }
}

class ProjectInfoDto {
  project: ProjectDto;
  member: ProjectMemberDto[];
  joinRequestList: JoinRequestListDto[];

  static of(
    project: Project,
    memberList: Member[],
    joinRequestList: ProjectJoinRequest[],
  ): ProjectInfoDto {
    const dto = new ProjectInfoDto();
    dto.project = ProjectDto.of(project);
    dto.member = memberList.map((member) => ProjectMemberDto.of(member));
    dto.joinRequestList = joinRequestList.map((joinRequest) =>
      JoinRequestListDto.of(joinRequest),
    );
    return dto;
  }
}

export class InitSettingResponseDto {
  domain: string;
  action: string;
  content: ProjectInfoDto;

  static of(
    project: Project,
    memberList: Member[],
    joinRequestList: ProjectJoinRequest[],
  ): InitSettingResponseDto {
    const dto = new InitSettingResponseDto();
    dto.domain = 'setting';
    dto.action = 'init';
    dto.content = ProjectInfoDto.of(project, memberList, joinRequestList);
    return dto;
  }
}
