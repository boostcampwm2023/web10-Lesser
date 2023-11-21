import { Body, Controller, Post } from '@nestjs/common';
import { CreateProjectRequestDto, CreateProjectResponseDto } from './dto/Project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsSevice: ProjectsService) {}
  @Post()
  createproject(@Body() body: CreateProjectRequestDto): Promise<CreateProjectResponseDto> {
    return this.projectsSevice.createProject(body);
  }
}
