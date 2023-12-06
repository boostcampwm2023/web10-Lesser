import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
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
import { ProjectsService } from './projects.service';

@UseGuards(IsLoginGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsSevice: ProjectsService) {}
  @Post()
  createproject(
    @Member() memberInfo: memberDecoratorType,
    @Body() body: CreateProjectRequestDto,
  ): Promise<CreateProjectResponseDto> {
    return this.projectsSevice.createProject(body, memberInfo);
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
