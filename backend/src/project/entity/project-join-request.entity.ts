import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Member } from 'src/member/entity/member.entity';

@Entity()
@Unique('PROJECT_JOIN_REQUEST_UQ_PROJECT_ID_AND_MEMBER_ID', [
  'projectId',
  'memberId',
])
export class ProjectJoinRequest {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @ManyToOne(() => Project, (project) => project.joinRequestList, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @Column({ type: 'int', name: 'project_id' })
  projectId: number;

  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Member)
  @Column({ type: 'int', name: 'member_id' })
  memberId: number;

  @ManyToOne(() => Member, (member) => member.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  static of(projectId: number, memberId: number) {
    const projectJoinRequest = new ProjectJoinRequest();
    projectJoinRequest.projectId = projectId;
    projectJoinRequest.memberId = memberId;
    return projectJoinRequest;
  }
}
