import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated,
} from 'typeorm';
import { ProjectToMember } from './project-member.entity';

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

  static of(title: string, subject: string) {
    const newProject = new Project();
    newProject.title = title;
    newProject.subject = subject;
    return newProject;
  }
}
