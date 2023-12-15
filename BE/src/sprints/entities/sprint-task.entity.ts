import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Sprint } from './sprint.entity';
import { Task } from 'src/backlogs/entities/task.entity';

@Entity()
export class SprintToTask extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @ManyToOne(() => Sprint, (sprint) => sprint.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sprintId' })
  sprint: Sprint;

  @ManyToOne(() => Task, (task) => task.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
