import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Project } from './project.entity';
import { Member } from 'src/member/entity/member.entity';
import { MemberRole } from '../enum/MemberRole.enum';

@Entity()
export class ProjectToMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Member, (member) => member.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ type: 'enum', enum: MemberRole, nullable: false })
  role: MemberRole;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  static of(project: Project, member: Member, role: MemberRole) {
    const newProjectToMember = new ProjectToMember();
    newProjectToMember.project = project;
    newProjectToMember.member = member;
    newProjectToMember.role = role;
    return newProjectToMember;
  }
}
