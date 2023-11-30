import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { Member } from 'src/members/entities/member.entity';
import { SprintToTask } from 'src/sprints/entities/sprint-task.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { EntityManager, IsNull, Repository } from 'typeorm';
import {
  GetSprintNotProgressResponseDto,
  GetSprintProgressResponseDto,
  GetSprintProgressTaskResponseDto,
} from './dto/GetSprintProgressRequest.dto';
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
    @InjectRepository(Sprint) private sprintRepository: Repository<Sprint>,
    @InjectEntityManager() private entityManager: EntityManager,
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

  async readProgressSprint(projectId: number): Promise<GetSprintProgressResponseDto | GetSprintNotProgressResponseDto> {
    const progressSprintData = await this.entityManager
      .createQueryBuilder(Sprint, 'Sprint')
      .innerJoinAndSelect('Sprint.sprintToTasks', 'SprintToTask')
      .innerJoinAndSelect('SprintToTask.task', 'Task')
      .innerJoinAndSelect('Task.story', 'Story')
      .innerJoinAndSelect('Task.member', 'Member')
      .where('Sprint.closed_date is null')
      .andWhere('Sprint.project_id = :projectId', { projectId })
      .getOne();
    if (progressSprintData === null) return { sprintEnd: true, sprintModal: false };
    return this.buildSprintProgressResponse(progressSprintData);
  }

  private buildSprintProgressResponse(progressSprintData: Sprint): GetSprintProgressResponseDto {
    const sprintProgressResponse = new GetSprintProgressResponseDto();
    sprintProgressResponse.sprintTitle = progressSprintData.title;
    sprintProgressResponse.sprintGoal = progressSprintData.goal;
    sprintProgressResponse.sprintStartDate = progressSprintData.start_date;
    sprintProgressResponse.sprintEndDate = progressSprintData.end_date;
    sprintProgressResponse.sprintEnd = false;
    //나중에 end_date가 현재보다 과거일 때 스프린트 삭제로직 추가
    sprintProgressResponse.sprintModal = progressSprintData.end_date < new Date();
    sprintProgressResponse.taskList = this.buildSprintProgressTask(progressSprintData.sprintToTasks);
    return sprintProgressResponse;
  }
  private buildSprintProgressTask(sprintToTasks: SprintToTask[]): GetSprintProgressTaskResponseDto[] {
    return sprintToTasks.map((sprintToTask) => ({
      id: sprintToTask.task.id,
      sequence: sprintToTask.task.sequence,
      title: sprintToTask.task.title,
      userId: sprintToTask.task.member.id,
      point: sprintToTask.task.point,
      state: sprintToTask.task.state,
      condition: sprintToTask.task.condition,
      storyId: sprintToTask.task.story.id,
      storySequence: sprintToTask.task.story.sequence,
      storyTitle: sprintToTask.task.story.title,
    }));
  }
}
