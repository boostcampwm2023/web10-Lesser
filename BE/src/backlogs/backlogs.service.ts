import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { createBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { createBacklogsTaskDto } from 'src/dto/create-backlogs-task.dto';
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

  async createEpic(dto: createBacklogsEpicDto): Promise<void> {
    const newEpic = this.epicRepository.create({ title: dto.epicTitle });
    await this.storyRepository.save(newEpic);
  }

  async createStory(dto: createBacklogsStoryDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.story.epicId } });
    const newStory = this.storyRepository.create({ title: dto.story.title, epic });
    await this.storyRepository.save(newStory);
  }

  async createTask(dto: createBacklogsTaskDto): Promise<void> {
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
}
