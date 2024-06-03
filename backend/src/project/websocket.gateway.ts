import { ValidationError } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  OnGatewayInit,
  MessageBody,
} from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Namespace, Socket } from 'socket.io';

import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { Member } from 'src/member/entity/member.entity';
import { Project } from './entity/project.entity';
import { MemberRepository } from 'src/member/repository/member.repository';
import { MemberService } from 'src/member/service/member.service';
import { ProjectService } from 'src/project/service/project.service';
import { MemoCreateRequestDto } from './dto/MemoCreateRequest.dto';
import { MemoDeleteRequestDto } from './dto/MemoDeleteRequest.dto';
import { InitLandingResponseDto } from './dto/InitLandingResponse.dto';
import { MemoColorUpdateRequestDto } from './dto/MemoColorUpdateRequest.dto';
import { MemberUpdateRequestDto } from './dto/MemberUpdateRequest.dto';
import { MemberStatus } from './enum/MemberStatus.enum';

interface ClientSocket extends Socket {
  projectId?: number;
  project: Project;
  member: Member;
  status: MemberStatus;
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
    private readonly memberService: MemberService,
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

  @SubscribeMessage('joinLanding')
  async handleJoinLandingEvent(@ConnectedSocket() client: ClientSocket) {
    client.status = MemberStatus.ON;
    const [project, projectMemberList, memoListWithMember] = await Promise.all([
      this.projectService.getProject(client.projectId),
      this.projectService.getProjectMemberList(client.project),
      this.projectService.getProjectMemoListWithMember(client.project.id),
    ]);
    const response = InitLandingResponseDto.of(
      project,
      client.member,
      projectMemberList,
      memoListWithMember,
    );
    client.emit('landing', response);
    client.join('landing');

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

  @SubscribeMessage('memo')
  async handleMemoEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody()
    data:
      | MemoCreateRequestDto
      | MemoDeleteRequestDto
      | MemoColorUpdateRequestDto,
  ) {
    if (data.action === 'create') {
      const errors = await validate(plainToClass(MemoCreateRequestDto, data));
      if (errors.length > 0) {
        const errorList = this.getRecursiveErrorMsgList(errors);
        client.emit('error', { errorList });
        return;
      }
      const { content } = data as MemoCreateRequestDto;
      const createdMemo = await this.projectService.createMemo(
        client.project,
        client.member,
        content.color,
      );
      const { username } = await this.memberService.getMember(client.member.id);
      client.nsp.to('landing').emit('landing', {
        domain: 'memo',
        action: 'create',
        content: {
          id: createdMemo.id,
          title: createdMemo.title,
          content: createdMemo.content,
          createdAt: createdMemo.created_at,
          author: username,
          color: createdMemo.color,
        },
      });
    } else if (data.action === 'delete') {
      const errors = await validate(plainToClass(MemoDeleteRequestDto, data));
      if (errors.length > 0) {
        const errorList = this.getRecursiveErrorMsgList(errors);
        client.emit('error', { errorList });
        return;
      }
      const { content } = data as MemoDeleteRequestDto;
      const isDeleted = await this.projectService.deleteMemo(content.id);
      if (isDeleted) {
        client.nsp.to('landing').emit('landing', {
          domain: 'memo',
          action: 'delete',
          content: {
            id: content.id,
          },
        });
      }
    } else if (data.action === 'colorUpdate') {
      const errors = await validate(
        plainToClass(MemoColorUpdateRequestDto, data),
      );
      if (errors.length > 0) {
        const errorList = this.getRecursiveErrorMsgList(errors);
        client.emit('error', { errorList });
        return;
      }
      const { content } = data as MemoColorUpdateRequestDto;

      let isUpdated;
      try {
        isUpdated = await this.projectService.updateMemoColor(
          client.project,
          content.id,
          content.color,
        );
      } catch (error) {
        if (error.message === 'project does not have this memo') {
          //ToDo: 에러상황 정의 후 응답 구현
          return;
        }
      }

      if (isUpdated) {
        client.nsp.to('landing').emit('landing', {
          domain: 'memo',
          action: 'colorUpdate',
          content: {
            id: content.id,
            color: content.color,
          },
        });
      }
    }
  }

  @SubscribeMessage('member')
  async handleMemberEvent(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() data: MemberUpdateRequestDto,
  ) {
    const errors = await validate(plainToClass(MemberUpdateRequestDto, data));
    if (errors.length > 0) {
      const errorList = this.getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const status = data.content.status;
    if (status === client.status) return;
    client.status = status;
    this.sendMemberStatusUpdate(client);
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

  private sendMemberStatusUpdate(client: ClientSocket) {
    client.nsp.to('landing').emit('landing', {
      domain: 'member',
      action: 'update',
      content: {
        id: client.member.id,
        status: client.status,
      },
    });
  }

  private getRecursiveErrorMsgList(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      if (error.children.length) {
        acc = acc.concat(this.getRecursiveErrorMsgList(error.children));
      }
      if (!error.constraints) return acc;
      return acc.concat(Object.values(error.constraints));
    }, []);
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
    client.project = project;
  }
}
