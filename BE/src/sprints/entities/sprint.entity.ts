import { Project } from 'src/projects/Domain/entity/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SprintToTask } from './sprint-task.entity';

@Entity()
export class Sprint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  goal: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  closed_date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  project_id: number;

  @ManyToOne(() => Project, (project) => project.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => SprintToTask, (sprintToTask) => sprintToTask.sprint)
  sprintToTasks: SprintToTask[];
}
