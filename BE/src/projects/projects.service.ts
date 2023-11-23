import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { Repository } from 'typeorm';
import { CreateProjectRequestDto, CreateProjectResponseDto, ReadProjectListResponseDto } from './dto/Project.dto';
import { Project } from './entity/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRespository: Repository<Project>,
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async createProject(dto: CreateProjectRequestDto): Promise<CreateProjectResponseDto> {
    const newProject = this.projectRespository.create({ name: dto.name, subject: dto.subject });
    const savedProject = await this.projectRespository.save(newProject);
    return { id: savedProject.id };
  }

  async readProjectList(): Promise<ReadProjectListResponseDto[]> {
    const projectListData = await this.projectRespository.find();
    const projectList = Promise.all(
      projectListData.map(async (projectData) => {
        const project = new ReadProjectListResponseDto();
        project.id = projectData.id;
        project.name = projectData.name;
        project.subject = projectData.subject;
        project.nextPage = 'backlogs';
        project.myTaskCount = await this.getTaskCount(project.id);
        return project;
      }),
    );
    return projectList;
  }

  private async getTaskCount(projectId: number): Promise<number> {
    let ret = 0;
    const epicDataList = await this.epicRepository.find({ where: { project: { id: projectId } } });
    for (let i = 0; i < epicDataList.length; i++) {
      const storyDataList = await this.storyRepository.find({ where: { epic: { id: epicDataList[i].id } } });
      for (let j = 0; j < storyDataList.length; j++) {
        ret += (await this.taskRepository.find({ where: { story: { id: storyDataList[j].id } } })).length;
      }
    }
    return ret;
  }
}
