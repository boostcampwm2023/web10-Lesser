import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { Project } from 'src/projects/entity/project.entity';
import { Repository } from 'typeorm';
import { MEpic, ReadBacklogResponseDto } from './dto/backlog.dto';
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
  ) {}

  async readBacklog(id: number): Promise<ReadBacklogResponseDto> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (project === null) throw new NotFoundException(`Project with ID ${id} not found`);
    const backlog: ReadBacklogResponseDto = { epicList: [] };
    const epicDataList = await this.epicRepository.find({ where: { project: { id: project.id } } });
    epicDataList.forEach((epicData) => {
      backlog.epicList.push({ id: epicData.id, title: epicData.title, storyList: [] });
    });
    await Promise.all(backlog.epicList.map((epic) => this.populateEpicWithStories(epic)));
    return backlog;
  }

  private async populateEpicWithStories(epic: MEpic) {
    const storyDataList = await this.storyRepository.find({ where: { epic: { id: epic.id } } });
    await Promise.all(storyDataList.map((storyData) => this.populateStoryWithTasks(storyData, epic)));
  }

  private async populateStoryWithTasks(storyData: Story, epic: MEpic) {
    const story = { id: storyData.id, title: storyData.title, taskList: [] };
    const taskDataList = await this.taskRepository.find({ where: { story: { id: story.id } } });
    taskDataList.forEach((taskData) => {
      story.taskList.push({
        userName: null,
        id: taskData.id,
        title: taskData.title,
        state: taskData.state,
        point: taskData.point,
        condition: taskData.condition,
      });
    });
    epic.storyList.push(story);
  }

  async createEpic(dto: CreateBacklogsEpicRequestDto): Promise<CreateBacklogsEpicResponseDto> {
    const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
    const newEpic = this.epicRepository.create({ title: dto.title, project: project });
    const savedEpic = await this.epicRepository.save(newEpic);
    return { id: savedEpic.id };
  }

  async createStory(dto: CreateBacklogsStoryRequestDto): Promise<CreateBacklogsStoryResponseDto> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.epicId } });
    const newStory = this.storyRepository.create({ title: dto.title, epic });
    const savedStory = await this.storyRepository.save(newStory);
    return { id: savedStory.id };
  }

  async createTask(dto: CreateBacklogsTaskRequestDto): Promise<CreateBacklogsTaskResponseDto> {
    const story = await this.storyRepository.findOne({ where: { id: dto.storyId } });
    const newTask = this.taskRepository.create({
      title: dto.title,
      state: dto.state,
      point: dto.point,
      condition: dto.condition,
      story,
    });
    if (dto.userId !== undefined) newTask.userId = dto.userId;
    const savedTask = await this.taskRepository.save(newTask);
    return { id: savedTask.id };
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
    if ((await this.taskRepository.findOne({ where: { id: dto.id } })) === null)
      throw new NotFoundException(`Task with ID ${dto.id} not found`);
    if (Object.keys(dto).length <= 1)
      throw new BadRequestException('No update data provided. Please specify the fields to be updated.');

    Object.keys(dto).forEach((key) => {
      if (dto[key] !== undefined) {
        updateTaskData[key] = dto[key];
      }
    });
    await this.taskRepository.update(dto.id, updateTaskData);
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
