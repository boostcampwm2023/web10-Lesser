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
    @InjectRepository(Epic) private EpicRepository: Repository<Epic>,
    @InjectRepository(Story) private StoryRepository: Repository<Story>,
  ) {}

  async createEpic(dto: createBacklogsEpicDto): Promise<void> {
    const newEpic = this.EpicRepository.create({ title: dto.epicTitle });
    await this.EpicRepository.save(newEpic);
  }

  async createStory(dto: createBacklogsStoryDto): Promise<void> {
    const epic = await this.EpicRepository.findOne({ where: { id: dto.projectId } });
    const newStory = this.StoryRepository.create({ title: dto.story.title, epic });
    await this.StoryRepository.save(newStory);
  }
}
