import { Member } from 'src/member/entity/member.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Story } from './story.entity';

export enum TaskStatus {
  NotStarted = '시작전',
  InProgress = '진행중',
  Completed = '완료',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'project_id', nullable: false })
  projectId: number;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'int', name: 'story_id', nullable: false })
  storyId: number;

  @ManyToOne(() => Story, (story) => story.taskList, { nullable: false })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'varchar', length: 99, nullable: false })
  title: string;

  @Column({ type: 'int', nullable: false })
  displayId: number;

  @Column({ type: 'double', nullable: true })
  expectedTime: number;

  @Column({ type: 'double', nullable: true })
  actualTime: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  status: TaskStatus;

  @Column({ type: 'int', name: 'member_id', nullable: true })
  assignedMemberId: number;

  @ManyToOne(() => Member, (member) => member.id, { nullable: true })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  static of(
    project: Project,
    storyId: number,
    title: string,
    displayId: number,
    expectedTime: number,
    actualTime: number,
    memberId: number,
    status: TaskStatus,
  ) {
    const newTask = new Task();
    newTask.project = project;
    newTask.storyId = storyId;
    newTask.title = title;
    newTask.displayId = displayId;

    newTask.expectedTime = expectedTime;
    newTask.actualTime = actualTime;
    newTask.assignedMemberId = memberId;
    newTask.status = status;
    return newTask;
  }
}
