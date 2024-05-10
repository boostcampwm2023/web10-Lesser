import { Member } from 'src/member/entity/member.entity';
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

export enum memoColor {
  YELLOW = 'yellow',
  BLUE = 'gray',
  GRAY = 'red',
  RED = 'blue',
}

@Entity()
export class Memo {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.id, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'varchar', length: 256, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Member, (member) => member.id, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ type: 'varchar', nullable: false })
  color: memoColor;

  static of(
    project: Project,
    member: Member,
    title: string,
    content: string,
    color: memoColor,
  ) {
    const newMemo = new Memo();
    newMemo.project = project;
    newMemo.member = member;
    newMemo.title = title;
    newMemo.content = content;
    newMemo.color = color;
    return newMemo;
  }
}
