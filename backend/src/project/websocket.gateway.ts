import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { Member } from 'src/member/entity/member.entity';
import { MemberRepository } from 'src/member/repository/member.repository';
import { ProjectService } from 'src/project/service/project.service';

interface ClientSocket extends Socket {
  projectId?: number;
  member: Member;
}

@WebSocketGateway({
  namespace: /project-\d+/,
  path: '/api/socket.io',
})
export class ProjectWebsocketGateway implements OnGatewayInit {
  constructor(
    private readonly projectService: ProjectService,
    private readonly lesserJwtService: LesserJwtService,
    private readonly memberRepository: MemberRepository,
  ) {}

  afterInit(server: Server) {
    server.use(async (client: ClientSocket, next) => {
      try {
        await this.authentication(client);
        await this.projectAuthorization(client);
      } catch (error) {
        if (error.message === 'Failed to verify token: access')
          error.message = 'Expired:accessToken';
        if (error.message === 'Project is not number')
          error.message = 'project not found';
        next(error);
      }
      next();
    });
  }

  @SubscribeMessage('joinLanding')
  async handleJoinLandingEvent(@ConnectedSocket() client: ClientSocket) {
    client.join('landing');
    const project = await this.projectService.getProject(client.projectId);
    const response = {
      action: 'init',
      content: {
        project: {
          title: project.title,
          subject: project.subject,
          createdAt: project.created_at,
        },
        myInfo: {},
        member: [],
        sprint: null,
        board: [],
        link: [],
        inviteLinkId: project.inviteLinkId,
      },
    };
    client.emit('landing', response);
  }

  private async authentication(client: ClientSocket) {
    const accessToken = client.handshake.auth?.accessToken;
    if (!accessToken) throw new Error('Bearer Token is missing');
    const {
      sub: { id },
    } = await this.lesserJwtService.getPayload(accessToken, 'access');
    const member = await this.memberRepository.findById(id);
    if (!member) throw new Error('assert: member must be found from database');
    client.member = member;
  }

  private async projectAuthorization(client: ClientSocket) {
    const projectId = client.nsp.name.match(/\/project-(\d+)/);
    if (projectId) {
      client.projectId = parseInt(projectId[1], 10);
      if (isNaN(client.projectId)) throw new Error('Project is not number');
    }
    const project = await this.projectService.getProject(client.projectId);
    if (!project) throw new Error('Project not found');
    const isProjectMember = await this.projectService.isProjectMember(
      project,
      client.member,
    );
    if (!isProjectMember) throw new Error('Not project member');
  }
}
