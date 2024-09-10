import { Member } from 'src/member/entity/member.entity';
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

class ProjectInfoDto {
  project: ProjectDto;
  member: ProjectMemberDto[];

  static of(project: Project, memberList: Member[]): ProjectInfoDto {
    const dto = new ProjectInfoDto();
    dto.project = ProjectDto.of(project);
    dto.member = memberList.map((member) => ProjectMemberDto.of(member));
    return dto;
  }
}

export class InitSettingResponseDto {
  domain: string;
  action: string;
  content: ProjectInfoDto;

  static of(project: Project, memberList: Member[]): InitSettingResponseDto {
    const dto = new InitSettingResponseDto();
    dto.domain = 'setting';
    dto.action = 'init';
    dto.content = ProjectInfoDto.of(project, memberList);
    return dto;
  }
}
