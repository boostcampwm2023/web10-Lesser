import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { createBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { Epic } from 'src/entities/epic.entity';
import { Story } from 'src/entities/story.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BacklogsService {
  constructor(
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
  ) {}

  async createEpic(dto: createBacklogsEpicDto): Promise<void> {
    const newEpic = this.epicRepository.create({ title: dto.epicTitle });
    await this.storyRepository.save(newEpic);
  }

  async createStory(dto: createBacklogsStoryDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.projectId } });
    const newStory = this.storyRepository.create({ title: dto.story.title, epic });
    await this.storyRepository.save(newStory);
  }
}
