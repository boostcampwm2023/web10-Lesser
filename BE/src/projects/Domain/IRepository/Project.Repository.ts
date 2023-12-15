import { Project } from '../entity/project.entity';

export interface IProjectRepository {
  save(project: Project): Promise<Project>;
}
