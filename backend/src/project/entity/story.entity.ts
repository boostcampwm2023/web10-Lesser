import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Epic } from './epic.entity';
import { Project } from './project.entity';
import { Task } from './task.entity';

export enum StoryStatus {
  NotStarted = '시작전',
  InProgress = '진행중',
  Completed = '완료',
}

@Entity()
export class Story {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'project_id' })
  projectId: number;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'int', name: 'epic_id' })
  epicId: number;

  @ManyToOne(() => Epic, (epic) => epic.storyList, { nullable: false })
  @JoinColumn({ name: 'epic_id' })
  epic: Epic;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'int', nullable: false })
  point: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  status: StoryStatus;

  @OneToMany(()=>Task, (task)=>task.story)
  taskList: Task[];

  static of(
    project: Project,
    epicId: number,
    title: string,
    point: number,
    status: StoryStatus,
  ) {
    const newStory = new Story();
    newStory.project = project;
    newStory.epicId = epicId;
    newStory.title = title;
    newStory.point = point;
    newStory.status = status;
    return newStory;
  }
}
