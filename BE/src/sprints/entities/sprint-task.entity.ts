import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sprint } from './sprint.entity';
import { Task } from 'src/backlogs/entities/task.entity';

@Entity()
export class SprintToTask extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @ManyToOne(() => Sprint, (sprint) => sprint.id)
  sprint: Sprint;

  @ManyToOne(() => Task, (task) => task.id)
  task: Task;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
