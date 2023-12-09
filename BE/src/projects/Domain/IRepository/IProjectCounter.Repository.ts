import { ProjectCounter } from '../entity/projectCounter.entity';

export interface IProjectCounterRepository {
  save(projectCounter: ProjectCounter): Promise<ProjectCounter>;
}
