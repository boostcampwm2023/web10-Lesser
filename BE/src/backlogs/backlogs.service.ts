import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { Epic } from 'src/entities/epic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BacklogsService {
  constructor(
    @InjectRepository(Epic) private EpicRepository: Repository<Epic>,
  ) {}

  async createEpic(dto: createBacklogsEpicDto): Promise<void> {
    const newEpic = this.EpicRepository.create({ title: dto.epicTitle });
    await this.EpicRepository.save(newEpic);
  }
}
