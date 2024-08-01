import { Member } from 'src/member/entity/member.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Project } from './project.entity';
import { Story } from './story.entity';

export enum TaskStatus {
  NotStarted = '시작전',
  InProgress = '진행중',
  Completed = '완료',
}

@Entity()
@Unique('TASK_UQ_RANK_VALUE_AND_STORY_ID', ['rankValue', 'storyId'])
export class Task {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'project_id', nullable: false })
  projectId: number;

  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'int', name: 'story_id', nullable: false })
  storyId: number;

  @ManyToOne(() => Story, (story) => story.taskList, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'varchar', length: 100, nullable: false })
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

  @ManyToOne(() => Member, (member) => member.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'rank_value' })
  rankValue: string;

  static of(
    project: Project,
    storyId: number,
    title: string,
    displayId: number,
    expectedTime: number,
    actualTime: number,
    memberId: number,
    status: TaskStatus,
    rankValue: string,
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
    newTask.rankValue = rankValue;
    return newTask;
  }
}
