import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { Member } from 'src/members/entities/member.entity';
import { Project } from 'src/projects/entity/project.entity';
import { ProjectCounter } from 'src/projects/entity/projectCounter.entity';
import { Repository } from 'typeorm';
import {
  ReadBacklogTaskResponseDto,
  ReadBacklogEpicResponseDto,
  ReadBacklogStoryResponseDto,
  ReadBacklogResponseDto,
} from './dto/backlog.dto';
import {
  CreateBacklogsEpicRequestDto,
  CreateBacklogsEpicResponseDto,
  DeleteBacklogsEpicRequestDto,
  UpdateBacklogsEpicRequestDto,
} from './dto/Epic.dto';
import {
  CreateBacklogsStoryRequestDto,
  CreateBacklogsStoryResponseDto,
  DeleteBacklogsStoryRequestDto,
  UpdateBacklogsStoryRequestDto,
} from './dto/Story.dto';
import {
  CreateBacklogsTaskRequestDto,
  CreateBacklogsTaskResponseDto,
  DeleteBacklogsTaskRequestDto,
  UpdateBacklogsRequestTaskDto,
} from './dto/Task.dto';

@Injectable()
export class BacklogsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(ProjectCounter) private projectCounterRepository: Repository<ProjectCounter>,
  ) {}

  async readNotDoneBacklog(projectId): Promise<ReadBacklogResponseDto> {
    const project = await this.findProject(projectId);
    const backlog = new ReadBacklogResponseDto();
    backlog.epicList = await this.findEpics(project.id);
    backlog.epicList.map((ReadBacklogEpicResponseDto) => {
      ReadBacklogEpicResponseDto.storyList = ReadBacklogEpicResponseDto.storyList.map((ReadBacklogStoryResponseDto) => {
        ReadBacklogStoryResponseDto.taskList = ReadBacklogStoryResponseDto.taskList.filter(
          (ReadBacklogTaskResponseDto) => ReadBacklogTaskResponseDto.state !== 'Done',
        );
        return ReadBacklogStoryResponseDto;
      });
      return ReadBacklogEpicResponseDto;
    });
    return backlog;
  }

  async readBacklog(id: number): Promise<ReadBacklogResponseDto> {
    const project = await this.findProject(id);
    const backlog = new ReadBacklogResponseDto();
    backlog.epicList = await this.findEpics(project.id);
    return backlog;
  }

  private async findProject(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['members'] });
    if (project === null) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  private async findEpics(projectId: number): Promise<ReadBacklogEpicResponseDto[]> {
    const epicDataList = await this.epicRepository.find({ where: { project: { id: projectId } } });
    return Promise.all(epicDataList.map(async (epicData) => this.buildEpic(epicData)));
  }

  private async buildEpic(epicData: Epic): Promise<ReadBacklogEpicResponseDto> {
    const epic = new ReadBacklogEpicResponseDto();
    epic.id = epicData.id;
    epic.title = epicData.title;
    epic.sequence = epicData.sequence;
    epic.storyList = await this.findStories(epic.id);
    return epic;
  }

  private async findStories(epicId: number): Promise<ReadBacklogStoryResponseDto[]> {
    const storyDataList = await this.storyRepository.find({ where: { epic: { id: epicId } } });
    return Promise.all(storyDataList.map(async (storyData) => this.buildStory(storyData)));
  }

  private async buildStory(storyData: Story): Promise<ReadBacklogStoryResponseDto> {
    const story = new ReadBacklogStoryResponseDto();
    story.id = storyData.id;
    story.title = storyData.title;
    story.sequence = storyData.sequence;
    story.taskList = await this.findTasks(story.id);
    return story;
  }

  private async findTasks(storyId: number): Promise<ReadBacklogTaskResponseDto[]> {
    const taskDataList = await this.taskRepository.find({ where: { story: { id: storyId } }, relations: ['member'] });
    return taskDataList.map((taskData) => this.buildTask(taskData));
  }

  private buildTask(taskData: Task): ReadBacklogTaskResponseDto {
    const task = new ReadBacklogTaskResponseDto();
    task.id = taskData.id;
    task.point = taskData.point;
    task.state = taskData.state;
    task.condition = taskData.condition;
    task.title = taskData.title;
    task.sequence = taskData.sequence;
    task.userId = taskData.member === null ? null : taskData.member.id;
    return task;
  }

  async createEpic(dto: CreateBacklogsEpicRequestDto): Promise<CreateBacklogsEpicResponseDto> {
    const project = await this.projectRepository.findOne({ where: { id: dto.parentId } });
    console.log(project);
    const epicCount = await this.getEpicCount(project.id);
    const newEpic = this.epicRepository.create({ title: dto.title, project: project, sequence: epicCount });
    const savedEpic = await this.epicRepository.save(newEpic);
    return { id: savedEpic.id, sequence: epicCount };
  }

  private async getEpicCount(projectId: number) {
    const projectCounter = await this.projectCounterRepository.findOne({ where: { projectId } });
    projectCounter.epicCount++;
    await projectCounter.save();
    return projectCounter.epicCount;
  }

  async createStory(dto: CreateBacklogsStoryRequestDto): Promise<CreateBacklogsStoryResponseDto> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.parentId }, relations: ['project'] });
    const storyCount = await this.getStoryCount(epic.project.id);
    const newStory = this.storyRepository.create({ title: dto.title, epic, sequence: storyCount });
    const savedStory = await this.storyRepository.save(newStory);
    return { id: savedStory.id, sequence: storyCount };
  }

  private async getStoryCount(projectId: number) {
    const projectCounter = await this.projectCounterRepository.findOne({ where: { projectId } });
    projectCounter.storyCount++;
    await projectCounter.save();
    return projectCounter.storyCount;
  }

  async createTask(dto: CreateBacklogsTaskRequestDto): Promise<CreateBacklogsTaskResponseDto> {
    const story = await this.storyRepository.findOne({ where: { id: dto.parentId }, relations: ['epic'] });
    const epic = await this.epicRepository.findOne({ where: { id: story.epic.id }, relations: ['project'] });
    const taskCount = await this.getTaskCount(epic.project.id);
    const newTask = this.taskRepository.create({
      title: dto.title,
      state: 'ToDo',
      point: dto.point,
      condition: dto.condition,
      sequence: taskCount,
      story,
    });
    if (dto.userId !== null) {
      const member = await this.memberRepository.findOne({ where: { id: dto.userId } });
      if (member === null) throw new NotFoundException();
      newTask.member = member;
    } else newTask.member = null;
    const savedTask = await this.taskRepository.save(newTask);

    return { id: savedTask.id, sequence: taskCount };
  }

  private async getTaskCount(projectId: number) {
    const projectCounter = await this.projectCounterRepository.findOne({ where: { projectId } });
    projectCounter.taskCount++;
    await projectCounter.save();
    return projectCounter.taskCount;
  }

  async updateEpic(dto: UpdateBacklogsEpicRequestDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.id } });
    epic.title = dto.title;
    await this.epicRepository.save(epic);
  }

  async updateStory(dto: UpdateBacklogsStoryRequestDto): Promise<void> {
    const story = await this.storyRepository.findOne({ where: { id: dto.id } });
    story.title = dto.title;
    await this.storyRepository.save(story);
  }

  async updateTask(dto: UpdateBacklogsRequestTaskDto): Promise<void> {
    const updateTaskData: Partial<Task> = {};
    if (dto.id === undefined) throw new BadRequestException('id must required');
    if (Object.keys(dto).length <= 1)
      throw new BadRequestException('No update data provided. Please specify the fields to be updated.');

    if (dto.userId === null) updateTaskData.member = null;
    else if (dto.userId !== undefined) {
      const member = await this.memberRepository.findOne({ where: { id: dto.userId } });
      if (member === null) throw new NotFoundException();
      updateTaskData.member = member;
    }

    Object.keys(dto).forEach(async (key) => {
      if (dto[key] !== undefined) {
        if (key !== 'userId') updateTaskData[key] = dto[key];
      }
    });
    const updateResult = await this.taskRepository.update(dto.id, updateTaskData);
    if (updateResult.affected === 0) throw new NotFoundException();
  }

  async deleteEpic(dto: DeleteBacklogsEpicRequestDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.id } });
    await this.epicRepository.remove(epic);
  }

  async deleteStory(dto: DeleteBacklogsStoryRequestDto): Promise<void> {
    const story = await this.storyRepository.findOne({ where: { id: dto.id } });
    await this.storyRepository.remove(story);
  }

  async deleteTask(dto: DeleteBacklogsTaskRequestDto): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: dto.id } });
    await this.taskRepository.remove(task);
  }
}
