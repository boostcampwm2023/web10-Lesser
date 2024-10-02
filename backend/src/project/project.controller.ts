import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ProjectService } from './service/project.service';
import { CreateProjectRequestDto } from './dto/CreateProjectRequest.dto';
import { MemberRequest } from 'src/common/guard/authentication.guard';
import { JoinProjectRequestDto } from './dto/JoinProjectRequest.dto';
import { Response } from 'express';
import { ProjectWebsocketGateway } from './websocket.gateway';
import { ProjectInvitePreviewResponseDto } from './dto/ProjectInvitePreviewResponse.dto';
import { ProjectJoinRequestRequestDto } from './dto/ProjectJoinRequest-Request.dto';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectWebsocketGateway: ProjectWebsocketGateway,
  ) {}
  @Get('/')
  async getProjectList(@Req() request: MemberRequest) {
    const projectList = await this.projectService.getProjectList(
      request.member,
    );
    const projects = projectList.map((project) => ({
      id: project.id,
      title: project.title,
      createdAt: project.created_at,
      currentSprint: null,
    }));

    return { projects };
  }

  @Post('/')
  async createProject(
    @Req() request: MemberRequest,
    @Body() body: CreateProjectRequestDto,
  ) {
    await this.projectService.createProject(
      request.member,
      body.title,
      body.subject,
    );
    return;
  }

  @Post('/join')
  async joinProject(
    @Req() request: MemberRequest,
    @Body() body: JoinProjectRequestDto,
    @Res() response: Response,
  ) {
    const project = await this.projectService.getProjectByLinkId(
      body.inviteLinkId,
    );
    if (!project) throw new NotFoundException();

    const isProjectMember = await this.projectService.isProjectMember(
      project.id,
      request.member,
    );
    if (isProjectMember)
      return response.status(200).send({ projectId: project.id });

    try {
      await this.projectService.addMember(project, request.member);
    } catch (err) {
      if (err.message === 'Project reached its maximum member capacity')
        throw new ConflictException(
          'Project reached its maximum member capacity',
        );
      throw err;
    }
    this.projectWebsocketGateway.notifyJoinToConnectedMembers(
      project.id,
      request.member,
    );
    return response.status(201).send();
  }

  @Post('/join-request')
  async submitProjectJoinRequest(
    @Req() request: MemberRequest,
    @Body() body: ProjectJoinRequestRequestDto,
    @Res() response: Response,
  ) {
    try {
      await this.projectService.createProjectJoinRequest(
        body.inviteLinkId,
        request.member,
      );
    } catch (e) {
      if (e.message === 'Join request already submitted') {
        throw new ConflictException(e.message);
      } else if (e.message === 'Already a project member') {
        throw new ConflictException(e.message);
      } else if (e.message === 'Project not found') {
        throw new NotFoundException(e.message);
      }
    }

    return response.status(201).send();
  }

  @Get('/invite-preview/:inviteLinkId')
  async getProjectInvitePreview(
    @Param('inviteLinkId') inviteLinkId: string,
    @Res() response: Response,
  ) {
    let projectPublicInfo;
    try {
      projectPublicInfo =
        await this.projectService.getProjectBriefInfoByInviteLinkId(
          inviteLinkId,
        );
    } catch (err) {
      if (err.message === 'Project Not Found') throw new NotFoundException();
      throw err;
    }
    return response
      .status(200)
      .send(
        ProjectInvitePreviewResponseDto.of(
          projectPublicInfo.id,
          projectPublicInfo.title,
          projectPublicInfo.subject,
          projectPublicInfo.leaderUsername,
        ),
      );
  }
}
