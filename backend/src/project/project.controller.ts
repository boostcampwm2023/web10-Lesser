import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './service/project.service';
import { CreateProjectRequestDto } from './dto/CreateProjectRequest.dto';
import {
  MemberRequest,
  AuthenticationGuard,
} from 'src/common/guard/authentication.guard';

@UseGuards(AuthenticationGuard)
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
}
