import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './service/project.service';
import { CreateProjectRequestDto } from './dto/CreateProjectRequest.dto';
import { MemberRequest } from 'src/common/guard/authentication.guard';
import { JoinProjectRequestDto } from './dto/JoinProjectRequest.dto';
import { Response } from 'express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
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
      project,
      request.member,
    );
    if (isProjectMember)
      return response.status(200).send({ projectId: project.id });

    await this.projectService.addMember(body.inviteLinkId, request.member);
    return response.status(201).send();
  }
}
