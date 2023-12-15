import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Project } from '../Domain/entity/project.entity';
import { IProjectRepository } from '../Domain/IRepository/Project.Repository';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private datasource: DataSource) {}

  async save(project: Project): Promise<Project> {
    return await this.datasource.manager.save(project);
  }
}
