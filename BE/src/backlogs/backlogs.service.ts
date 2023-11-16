import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { CreateBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { CreateBacklogsTaskDto } from 'src/dto/create-backlogs-task.dto';
import { DeleteBacklogsEpicDto } from 'src/dto/delete-backlogs-epic.dto';
import { DeleteBacklogsStoryDto } from 'src/dto/delete-backlogs-story.dto';
import { DeleteBacklogsTaskDto } from 'src/dto/delete-backlogs-task.dto';
import { UpdateBacklogsEpicDto } from 'src/dto/update-backlogs-epic.dto';
import { UpdateBacklogsStoryDto } from 'src/dto/update-backlogs-story.dto';
import { UpdateBacklogsTaskDto } from 'src/dto/update-backlogs-task.dto';
import { Epic } from 'src/entities/epic.entity';
import { Story } from 'src/entities/story.entity';
import { Task } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BacklogsService {
  constructor(
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async createEpic(dto: CreateBacklogsEpicDto): Promise<void> {
    const newEpic = this.epicRepository.create({ title: dto.epicTitle });
    await this.epicRepository.save(newEpic);
  }

  async createStory(dto: CreateBacklogsStoryDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.story.epicId } });
    const newStory = this.storyRepository.create({ title: dto.story.title, epic });
    await this.storyRepository.save(newStory);
  }

  async createTask(dto: CreateBacklogsTaskDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.task.epicId } });
    const story = await this.storyRepository.findOne({ where: { id: dto.task.storyId } });
    const newTask = this.taskRepository.create({
      title: dto.task.title,
      state: dto.task.state,
      point: dto.task.point,
      condition: dto.task.condition,
      userId: dto.task.userId,
      epic,
      story,
    });
    await this.taskRepository.save(newTask);
  }

  async updateEpic(dto: UpdateBacklogsEpicDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.epic.id } });
    epic.title = dto.epic.title;
    await this.epicRepository.save(epic);
  }

  async updateStory(dto: UpdateBacklogsStoryDto): Promise<void> {
    const story = await this.storyRepository.findOne({ where: { id: dto.story.id } });
    story.title = dto.story.title;
    await this.storyRepository.save(story);
  }

  async updateTask(dto: UpdateBacklogsTaskDto): Promise<void> {
    const Task = await this.taskRepository.findOne({ where: { id: dto.task.id } });
    Task.title = dto.task.title || Task.title;
    Task.state = dto.task.state || Task.state;
    Task.point = dto.task.point || Task.point;
    Task.condition = dto.task.condition || Task.condition;
    Task.userId = dto.task.userId || Task.userId;
    await this.taskRepository.save(Task);
  }

  async deleteEpic(dto: DeleteBacklogsEpicDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.epicId } });
    await this.epicRepository.remove(epic);
  }

  async deleteStory(dto: DeleteBacklogsStoryDto): Promise<void> {
    const story = await this.storyRepository.findOne({ where: { id: dto.storyId } });
    await this.storyRepository.remove(story);
  }

  async deleteTask(dto: DeleteBacklogsTaskDto): Promise<void> {
    const Task = await this.taskRepository.findOne({ where: { id: dto.taskId } });
    await this.taskRepository.remove(Task);
  }
}
