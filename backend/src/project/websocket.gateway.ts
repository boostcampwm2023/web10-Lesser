import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  OnGatewayInit,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';

import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { Member } from 'src/member/entity/member.entity';
import { MemberRepository } from 'src/member/repository/member.repository';
import { ProjectService } from 'src/project/service/project.service';
import { MemberStatus } from './enum/MemberStatus.enum';
import { WsProjectMemoController } from './ws-controller/ws-project-memo.controller';
import { WsProjectMemberController } from './ws-controller/ws-project-member.controller';
import { WsProjectLinkController } from './ws-controller/ws-project-link.controller';
import { WsProjectController } from './ws-controller/ws-project.controller';
import { ClientSocket } from './type/ClientSocket.type';
import { WsProjectEpicController } from './ws-controller/ws-project-epic.controller';
import { WsProjectStoryController } from './ws-controller/ws-project-story.controller';
import { WsProjectTaskController } from './ws-controller/ws-project-task.controller';
import { WsProjectInfoController } from './ws-controller/ws-project-info.controller';

@WebSocketGateway({
  namespace: /project-\d+/,
  path: '/api/socket.io',
})
export class ProjectWebsocketGateway
  implements OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly projectService: ProjectService,
    private readonly lesserJwtService: LesserJwtService,
    private readonly memberRepository: MemberRepository,
    private readonly wsProjectMemoController: WsProjectMemoController,
    private readonly wsProjectMemberController: WsProjectMemberController,
    private readonly wsProjectLinkController: WsProjectLinkController,
    private readonly wsProjectController: WsProjectController,
    private readonly wsProjectEpicController: WsProjectEpicController,
    private readonly wsProjectStoryController: WsProjectStoryController,
    private readonly wsProjectTaskController: WsProjectTaskController,
    private readonly wsProjectInfoController: WsProjectInfoController,
  ) {
    this.namespaceMap = new Map();
  }

  namespaceMap: Map<number, Namespace>;

  afterInit(parentNamespace: any) {
    parentNamespace.use(async (client: ClientSocket, next) => {
      try {
        await this.authentication(client);
        await this.projectAuthorization(client);

        if (!this.namespaceMap.has(client.projectId))
          this.namespaceMap.set(client.projectId, client.nsp);
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

  async handleDisconnect(client: ClientSocket) {
    if (!client.member) return;

    const projectSocketList: ClientSocket[] =
      (await client.nsp.fetchSockets()) as unknown as ClientSocket[];
    const sameMember = projectSocketList.find(
      (socket) =>
        socket.member.id === client.member.id && socket.id !== client.id,
    );
    if (sameMember) return;
    client.nsp
      .to('landing')
      .except(client.id)
      .emit('landing', {
        domain: 'member',
        action: 'update',
        content: {
          id: client.member.id,
          status: MemberStatus.OFF,
        },
      });
  }

  @SubscribeMessage('joinLanding')
  async handleJoinLandingEvent(@ConnectedSocket() client: ClientSocket) {
    this.wsProjectController.joinLandingPage(client);
  }

  @SubscribeMessage('memo')
  async handleMemoEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody()
    data,
  ) {
    if (data.action === 'create') {
      this.wsProjectMemoController.createMemo(client, data);
    } else if (data.action === 'delete') {
      this.wsProjectMemoController.deleteMemo(client, data);
    } else if (data.action === 'colorUpdate') {
      this.wsProjectMemoController.updateColor(client, data);
    }
  }

  @SubscribeMessage('member')
  async handleMemberEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() data: any,
  ) {
    if (data.action === 'update') {
      this.wsProjectMemberController.updateMemberState(client, data);
    }
  }

  @SubscribeMessage('link')
  async handleLinkEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() data: any,
  ) {
    if (data.action === 'create') {
      this.wsProjectLinkController.createLink(client, data);
    } else if (data.action === 'delete') {
      this.wsProjectLinkController.deleteLink(client, data);
    }
  }

  @SubscribeMessage('joinBacklog')
  async handleJoinBacklogEvent(@ConnectedSocket() client: ClientSocket) {
    this.wsProjectController.joinBacklogPage(client);
  }

  @SubscribeMessage('epic')
  async handleEpicEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() data: any,
  ) {
    if (data.action === 'create') {
      this.wsProjectEpicController.createEpic(client, data);
    } else if (data.action === 'delete') {
      this.wsProjectEpicController.deleteEpic(client, data);
    } else if (data.action === 'update') {
      this.wsProjectEpicController.updateEpic(client, data);
    }
  }

  @SubscribeMessage('story')
  async handleStoryEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() data: any,
  ) {
    if (data.action === 'create') {
      this.wsProjectStoryController.createStory(client, data);
    } else if (data.action === 'delete') {
      this.wsProjectStoryController.deleteStory(client, data);
    } else if (data.action === 'update') {
      this.wsProjectStoryController.updateStory(client, data);
    }
  }

  @SubscribeMessage('task')
  async handleTaskEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() data: any,
  ) {
    if (data.action === 'create') {
      this.wsProjectTaskController.createTask(client, data);
    } else if (data.action === 'delete') {
      this.wsProjectTaskController.deleteTask(client, data);
    } else if (data.action === 'update') {
      this.wsProjectTaskController.updateTask(client, data);
    }
  }
  @SubscribeMessage('joinSetting')
  async handleJoinSettingEvent(@ConnectedSocket() client: ClientSocket) {
    this.wsProjectController.joinSettingPage(client);
  }

  @SubscribeMessage('projectInfo')
  async handleProjectInfoEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() data: any,
  ) {
    if (data.action === 'update') {
      this.wsProjectInfoController.updateProjectInfo(client, data);
    }
  }

  notifyJoinToConnectedMembers(projectId: number, member: Member) {
    const projectNamespace = this.namespaceMap.get(projectId);
    if (!projectNamespace) return;
    const requestMsg = {
      domain: 'member',
      action: 'create',
      content: {
        id: member.id,
        username: member.username,
        imageUrl: member.github_image_url,
        status: 'off',
      },
    };
    projectNamespace.to('landing').emit('landing', requestMsg);
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
    const project = await this.projectService.getProject(
      client.projectId,
      client.member,
    );
    client.project = project;
  }
}
