import { Project } from 'src/projects/entity/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Project, (project) => project.id, { nullable: false, onDelete: 'CASCADE' })
  project: Project;

  @OneToMany(() => SprintToTask, (sprintToTask) => sprintToTask.sprint)
  sprintToTasks: SprintToTask[];
}
