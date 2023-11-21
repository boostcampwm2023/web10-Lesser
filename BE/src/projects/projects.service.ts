import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectRequestDto, CreateProjectResponseDto } from './dto/Project.dto';
import { Project } from './entity/project.entity';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private projectRespository: Repository<Project>) {}
  async createProject(dto: CreateProjectRequestDto): Promise<CreateProjectResponseDto> {
    const newProject = this.projectRespository.create({ name: dto.name });
    const savedProject = await this.projectRespository.save(newProject);
    return { id: savedProject.id };
  }
}
