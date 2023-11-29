import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { Member } from 'src/members/entities/member.entity';
import { Repository } from 'typeorm';
import {
  CreateProjectRequestDto,
  CreateProjectResponseDto,
  ReadProjectListResponseDto,
  ReadUserResponseDto,
} from './dto/Project.dto';
import { Project } from './entity/project.entity';
import { ProjectCounter } from './entity/projectCounter.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRespository: Repository<Project>,
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(ProjectCounter) private projectCounterRepository: Repository<ProjectCounter>,
  ) {}

  async createProject(
    dto: CreateProjectRequestDto,
    memberInfo: memberDecoratorType,
  ): Promise<CreateProjectResponseDto> {
    const member = await this.memberRepository.findOne({ where: { id: memberInfo.id } });
    if (!member) throw new InternalServerErrorException();
    const newProject = this.projectRespository.create({ name: dto.name, subject: dto.subject, members: [] });
    newProject.members.push(member);
    const savedProject = await this.projectRespository.save(newProject);
    const newProjectCounter = this.projectCounterRepository.create({ projectId: newProject.id });
    await this.projectCounterRepository.save(newProjectCounter);
    return { id: savedProject.id };
  }

  async readProjectList(memberInfo: memberDecoratorType): Promise<ReadProjectListResponseDto[]> {
    const projectListData = await this.projectRespository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.members', 'members')
      .where('members.id = :id', { id: memberInfo.id })
      .getMany();

    const projectList = Promise.all(
      projectListData.map(async (projectData) => {
        const project = new ReadProjectListResponseDto();
        project.id = projectData.id;
        project.name = projectData.name;
        project.subject = projectData.subject;
        project.nextPage = 'backlogs';
        project.myTaskCount = await this.getTaskCount(project.id);
        project.userList = await this.getUserList(projectData.id);
        return project;
      }),
    );
    return projectList;
  }

  private async getTaskCount(projectId: number): Promise<number> {
    const epicDataList = await this.epicRepository.find({ where: { project: { id: projectId } } });
    const taskDataLists = await Promise.all(
      epicDataList.map(async (epicData) => {
        const storyDataList = await this.storyRepository.find({ where: { epic: { id: epicData.id } } });
        return await Promise.all(
          storyDataList.map(
            async (storyData) => await this.taskRepository.find({ where: { story: { id: storyData.id } } }),
          ),
        );
      }),
    );
    return taskDataLists.flat(2).length;
  }

  private async getUserList(projectId: number): Promise<ReadUserResponseDto[]> {
    const projectData = await this.projectRespository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.members', 'member')
      .where('project.id = :projectId', { projectId })
      .getOne();

    return projectData.members.map((member) => {
      const readUserResponse = new ReadUserResponseDto();
      readUserResponse.userId = member.id;
      readUserResponse.userName = member.email;
      return readUserResponse;
    });
  }
}
