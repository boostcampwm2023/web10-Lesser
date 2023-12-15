import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { IsLoginGuard } from 'src/common/auth/IsLogin.guard';
import { Member } from 'src/common/decorators/memberDecorator';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { GetSprintNotProgressResponseDto, GetSprintProgressResponseDto } from './dto/GetSprintProgressRequest.dto';
import {
  CreateProjectRequestDto,
  CreateProjectResponseDto,
  AddProjectMemberRequestDto,
  ReadProjectListResponseDto,
} from './dto/Project.dto';
import { ProjectsService } from '../Domain/Service/projects.service';
import { ProjectNotFoundError } from '../Domain/Error/ProjectError';

@UseGuards(IsLoginGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsSevice: ProjectsService) {}
  @Post()
  async createproject(@Body() body: CreateProjectRequestDto): Promise<CreateProjectResponseDto> {
    try {
      const newProjectId = await this.projectsSevice.createProject(body.name, body.subject, body.memberList);
      return { id: newProjectId };
    } catch (err) {
      if (err instanceof ProjectNotFoundError) throw new NotFoundException();
      throw err;
    }
  }

  @Get()
  readProjectList(@Member() memberInfo: memberDecoratorType): Promise<ReadProjectListResponseDto[]> {
    return this.projectsSevice.readProjectList(memberInfo);
  }

  @Get(':projectId/sprints/progress')
  readProgressSprint(
    @Member() memberInfo,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<GetSprintProgressResponseDto | GetSprintNotProgressResponseDto> {
    return this.projectsSevice.readProgressSprint(projectId);
  }

  @Post('members')
  addProjectMember(@Body() body: AddProjectMemberRequestDto) {
    return this.projectsSevice.addProjectMember(body);
  }
}
