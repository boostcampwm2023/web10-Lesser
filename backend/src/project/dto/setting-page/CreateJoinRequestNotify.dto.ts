import { Member } from 'src/member/entity/member.entity';
import { ProjectJoinRequest } from 'src/project/entity/project-join-request.entity';

class JoinRequestDto {
  id: number;
  memberId: number;
  username: string;
  imageUrl: string;

  static of(
    projectJoinRequest: ProjectJoinRequest,
    member: Member,
  ): JoinRequestDto {
    const dto = new JoinRequestDto();
    dto.id = projectJoinRequest.id;
    dto.memberId = member.id;
    dto.username = member.username;
    dto.imageUrl = member.github_image_url;
    return dto;
  }
}

class ContentDto {
  joinRequest: JoinRequestDto;

  static of(joinRequest: ProjectJoinRequest, member: Member): ContentDto {
    const dto = new ContentDto();
    dto.joinRequest = JoinRequestDto.of(joinRequest, member);
    return dto;
  }
}

export class CreateJoinRequestNotifyDto {
  domain: string;
  action: string;
  content: ContentDto;

  static of(
    joinRequest: ProjectJoinRequest,
    member: Member,
  ): CreateJoinRequestNotifyDto {
    const dto = new CreateJoinRequestNotifyDto();
    dto.domain = 'joinRequest';
    dto.action = 'create';
    dto.content = ContentDto.of(joinRequest, member);
    return dto;
  }
}
