import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class ProjectCounter extends BaseEntity {
  @PrimaryColumn()
  projectId: number;

  @OneToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ default: 0 })
  epicCount: number;

  @Column({ default: 0 })
  storyCount: number;

  @Column({ default: 0 })
  taskCount: number;

  static createProjectCounter(projectId: number): ProjectCounter {
    const newProjectCounter = new ProjectCounter();
    newProjectCounter.projectId = projectId;
    return newProjectCounter;
  }
}
