import { Injectable } from '@nestjs/common';
import { InitLandingResponseDto } from '../dto/InitLandingResponse.dto';
import { MemberStatus } from '../enum/MemberStatus.enum';
import { ProjectService } from '../service/project.service';
import { ClientSocket } from '../type/ClientSocket.type';

@Injectable()
export class WsProjectController {
  constructor(private readonly projectService: ProjectService) {}

  async joinLandingPage(client: ClientSocket) {
    const [project, projectMemberList, memoListWithMember, linkList] =
      await Promise.all([
        this.projectService.getProject(client.projectId),
        this.projectService.getProjectMemberList(client.project),
        this.projectService.getProjectMemoListWithMember(client.project.id),
        this.projectService.getProjectLinkList(client.project),
      ]);
    const projectSocketList: ClientSocket[] =
      (await client.nsp.fetchSockets()) as unknown as ClientSocket[];

    const sameMemberSocket = projectSocketList.find(
      (socket) =>
        socket.member.id === client.member.id && socket.id !== client.id,
    );

    if (sameMemberSocket) client.status = sameMemberSocket.status;
    else client.status = MemberStatus.ON;

    const response = InitLandingResponseDto.of(
      project,
      client.member,
      client.status,
      projectSocketList,
      projectMemberList,
      memoListWithMember,
      linkList,
    );
    client.emit('landing', response);
    client.join('landing');

    if (sameMemberSocket) return;
    client.nsp
      .to('landing')
      .except(client.id)
      .emit('landing', {
        domain: 'member',
        action: 'update',
        content: {
          id: client.member.id,
          status: client.status,
        },
      });
  }
}
