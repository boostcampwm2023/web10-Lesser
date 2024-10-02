import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated,
} from 'typeorm';
import { Epic } from './epic.entity';
import { Link } from './link.entity.';
import { Memo } from './memo.entity';
import { ProjectToMember } from './project-member.entity';
import { ProjectJoinRequest } from './project-join-request.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 256, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  subject: string;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  inviteLinkId: string;

  @OneToMany(
    () => ProjectToMember,
    (projectToMember) => projectToMember.project,
  )
  projectToMember: ProjectToMember[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Memo, (memo) => memo.id)
  memoList: Memo[];

  @OneToMany(() => Link, (link) => link.id)
  linkList: Link[];

  @Column({ type: 'int', nullable: false })
  displayIdCount: number;

  @OneToMany(() => Epic, (epic) => epic.project)
  epicList: Epic[];

  @OneToMany(() => ProjectJoinRequest, (JoinRequest) => JoinRequest.project)
  joinRequestList: ProjectJoinRequest[];

  static of(title: string, subject: string) {
    const newProject = new Project();
    newProject.title = title;
    newProject.subject = subject;
    newProject.displayIdCount = 0;
    return newProject;
  }
}
