import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';

export enum EpicColor {
  YELLOW = 'yellow',
  BLUE = 'gray',
  GRAY = 'red',
  RED = 'blue',
  GREEN = 'green',
  ORANGE = 'orange',
  PURPLE = 'purple',
}

@Entity()
export class Epic {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'project_id' })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.id, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  color: EpicColor;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  static of(project: Project, name: string, color: EpicColor) {
    const newEpic = new Epic();
    newEpic.project = project;
    newEpic.name = name;
    newEpic.color = color;
    return newEpic;
  }
}
