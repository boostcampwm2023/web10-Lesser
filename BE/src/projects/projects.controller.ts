import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProjectRequestDto, CreateProjectResponseDto, ReadProjectListResponseDto } from './dto/Project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsSevice: ProjectsService) {}
  @Post()
  createproject(@Body() body: CreateProjectRequestDto): Promise<CreateProjectResponseDto> {
    return this.projectsSevice.createProject(body);
  }

  @Get()
  readProjectList(): Promise<ReadProjectListResponseDto[]> {
    return this.projectsSevice.readProjectList();
  }
}
