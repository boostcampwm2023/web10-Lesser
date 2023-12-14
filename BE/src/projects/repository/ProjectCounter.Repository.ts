import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProjectCounter } from '../Domain/entity/projectCounter.entity';
import { IProjectCounterRepository } from '../Domain/IRepository/IProjectCounter.Repository';

@Injectable()
export class ProjectCounterRepository implements IProjectCounterRepository {
  constructor(private datasource: DataSource) {}

  async save(projectCounter: ProjectCounter): Promise<ProjectCounter> {
    return await this.datasource.manager.save(projectCounter);
  }
}
