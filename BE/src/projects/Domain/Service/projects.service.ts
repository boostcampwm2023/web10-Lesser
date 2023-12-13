import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { SprintToTask } from 'src/sprints/entities/sprint-task.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { ProjectRepository } from '../../repository/Project.Repository';
import { ProjectCounterRepository } from '../../repository/ProjectCounter.Repository';
import {
  GetSprintNotProgressResponseDto,
  GetSprintProgressResponseDto,
  GetSprintProgressTaskResponseDto,
} from '../../Controller/dto/GetSprintProgressRequest.dto';
import {
  AddProjectMemberRequestDto,
  AddProjectMemberResponseDto,
  ReadProjectListResponseDto,
  ReadUserResponseDto,
} from '../../Controller/dto/Project.dto';
import { Project } from '../entity/project.entity';
import { ProjectCounter } from '../entity/projectCounter.entity';
import { ProjectNotFoundError } from '../Error/ProjectError';
import { IProjectRepository } from '../IRepository/Project.Repository';
import { IMemberRepository } from 'src/members/repository/Imember.repository';
import { Transactional } from 'typeorm-transactional';
import { IProjectCounterRepository } from '../IRepository/IProjectCounter.Repository';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('ProjectRepo') private projectRepository: IProjectRepository,
    @Inject('ProjectCounterRepo') private projectCounterRepository: IProjectCounterRepository,
    @Inject('MemberRepo') private memberRepository: IMemberRepository,
    @InjectRepository(Project) private tempProjectRespository: Repository<Project>,
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Sprint) private sprintRepository: Repository<Sprint>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  @Transactional()
  async createProject(name: string, subject: string, memberIdList: number[]): Promise<number> {
    const newProject = Project.createProject(name, subject);
    const members = await this.memberRepository.findIn(memberIdList);
    if (members.length !== memberIdList.length) throw new ProjectNotFoundError();
    newProject.addMembers(members);
    const savedProject = await this.projectRepository.save(newProject);
    const newProjectCounter = ProjectCounter.createProjectCounter(savedProject.id);
    await this.projectCounterRepository.save(newProjectCounter);
    return savedProject.id;
  }

  async readProjectList(memberInfo: memberDecoratorType): Promise<ReadProjectListResponseDto[]> {
    const projectListData = await this.tempProjectRespository
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
        project.nextPage = (await this.hasProgressSprint(project.id)) ? 'sprints' : 'backlogs';
        project.myTaskCount = await this.getTaskCount(project.id, memberInfo);
        project.userList = await this.getUserList(projectData.id);
        return project;
      }),
    );
    return projectList;
  }

  private async hasProgressSprint(projectId: number) {
    const sprintData = await this.sprintRepository.findOne({ where: { project_id: projectId, closed_date: IsNull() } });
    if (sprintData === null) return false;
    return true;
  }

  private async getTaskCount(projectId: number, memberInfo: memberDecoratorType): Promise<number> {
    const epicDataList = await this.epicRepository.find({ where: { project: { id: projectId } } });
    const taskDataLists = await Promise.all(
      epicDataList.map(async (epicData) => {
        const storyDataList = await this.storyRepository.find({ where: { epic: { id: epicData.id } } });
        return await Promise.all(
          storyDataList.map(
            async (storyData) =>
              await this.taskRepository.find({
                where: { story: { id: storyData.id }, member: { id: memberInfo.id }, state: 'InProgress' },
              }),
          ),
        );
      }),
    );
    return taskDataLists.flat(2).length;
  }

  private async getUserList(projectId: number): Promise<ReadUserResponseDto[]> {
    const projectData = await this.tempProjectRespository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.members', 'member')
      .where('project.id = :projectId', { projectId })
      .getOne();

    return projectData.members.map((member) => {
      const readUserResponse = new ReadUserResponseDto();
      readUserResponse.userId = member.id;
      readUserResponse.userName = member.github_id;
      return readUserResponse;
    });
  }

  async readProgressSprint(projectId: number): Promise<GetSprintProgressResponseDto | GetSprintNotProgressResponseDto> {
    const progressSprintData = await this.entityManager
      .createQueryBuilder(Sprint, 'Sprint')
      .leftJoinAndSelect('Sprint.sprintToTasks', 'SprintToTask')
      .leftJoinAndSelect('SprintToTask.task', 'Task')
      .leftJoinAndSelect('Task.story', 'Story')
      .leftJoinAndSelect('Task.member', 'Member')
      .where('Sprint.closed_date is null')
      .andWhere('Sprint.project_id = :projectId', { projectId })
      .getOne();
    if (progressSprintData === null) return { sprintEnd: true, sprintModal: false };
    return this.buildSprintProgressResponse(progressSprintData);
  }

  private async buildSprintProgressResponse(progressSprintData: Sprint): Promise<GetSprintProgressResponseDto> {
    const sprintProgressResponse = new GetSprintProgressResponseDto();
    sprintProgressResponse.sprintId = progressSprintData.id;
    sprintProgressResponse.sprintTitle = progressSprintData.title;
    sprintProgressResponse.sprintGoal = progressSprintData.goal;
    sprintProgressResponse.sprintStartDate = progressSprintData.start_date;
    sprintProgressResponse.sprintEndDate = progressSprintData.end_date;
    sprintProgressResponse.sprintEnd = false;
    sprintProgressResponse.sprintModal = progressSprintData.end_date < new Date();
    if (progressSprintData.end_date < new Date()) {
      await this.sprintRepository.update({ id: progressSprintData.id }, { closed_date: new Date() });
    }
    sprintProgressResponse.taskList = this.buildSprintProgressTask(progressSprintData.sprintToTasks);
    return sprintProgressResponse;
  }
  private buildSprintProgressTask(sprintToTasks: SprintToTask[]): GetSprintProgressTaskResponseDto[] {
    return sprintToTasks.map((sprintToTask) => ({
      id: sprintToTask.task.id,
      sequence: sprintToTask.task.sequence,
      title: sprintToTask.task.title,
      userId: sprintToTask.task.member ? sprintToTask.task.member.id : null,
      point: sprintToTask.task.point,
      state: sprintToTask.task.state,
      condition: sprintToTask.task.condition,
      storyId: sprintToTask.task.story.id,
      storySequence: sprintToTask.task.story.sequence,
      storyTitle: sprintToTask.task.story.title,
    }));
  }

  async addProjectMember(dto: AddProjectMemberRequestDto): Promise<AddProjectMemberResponseDto> {
    const project = await this.tempProjectRespository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.members', 'member')
      .where('project.id = :projectId', { projectId: dto.id })
      .getOne();
    const projectMemberIdList = project.members.map((member) => member.id);
    const newMemberIdList = dto.memberList.filter((memberId) => !projectMemberIdList.includes(memberId));
    const newMembers = await this.memberRepository.findIn(newMemberIdList);
    project.members.push(...newMembers);
    const savedProject = await this.tempProjectRespository.save(project);
    return {
      id: savedProject.id,
      memberList: savedProject.members.map((member) => ({
        id: member.id,
        username: member.username,
        imageUrl: member.image_url,
      })),
    };
  }
}
