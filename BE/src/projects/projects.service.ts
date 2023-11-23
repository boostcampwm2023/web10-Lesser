import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectRequestDto, CreateProjectResponseDto, ReadProjectListResponseDto } from './dto/Project.dto';
import { Project } from './entity/project.entity';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private projectRespository: Repository<Project>) {}

  async createProject(dto: CreateProjectRequestDto): Promise<CreateProjectResponseDto> {
    const newProject = this.projectRespository.create({ name: dto.name, subject: dto.subject });
    const savedProject = await this.projectRespository.save(newProject);
    return { id: savedProject.id };
  }

  async readProjectList(): Promise<ReadProjectListResponseDto[]> {
    const projectListData = await this.projectRespository.find();
    const projectList = projectListData.map((projectData) => {
      const project = new ReadProjectListResponseDto();
      project.id = projectData.id;
      project.name = projectData.name;
      project.subject = projectData.subject;
      project.nextPage = 'backlogs';
      return project;
    });
    return projectList;
  }
}
