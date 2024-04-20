import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ProjectService } from 'src/project/service/project.service';

interface ClientSocket extends Socket {
  projectId?: number;
}

@WebSocketGateway({
  namespace: /project-\d+/,
  path: '/api/socket.io',
})
export class ProjectWebsocketGateway implements OnGatewayConnection {
  constructor(private readonly projectService: ProjectService) {}
  handleConnection(client: ClientSocket, ...args: any[]) {
    const projectId = client.nsp.name.match(/\/project-(\d+)/);

    // Todo: 인증(access Token)
    // Todo: 인가(projectId에 접근할 수 있는 멤버인지 확인하기!)
    if (projectId) {
      client.projectId = parseInt(projectId[1], 10);
    } else {
      // Todo: disconnect socket
    }
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
}
