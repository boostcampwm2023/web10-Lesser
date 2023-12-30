import { Member } from 'src/members/domain/entity/member.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  subject: string;

  @ManyToMany(() => Member, (Member) => Member.projects)
  @JoinTable({ name: 'Member_Project' })
  members: Member[];

  @OneToMany((type) => Sprint, (Sprint) => Sprint.project)
  sprints: Sprint[];

  static createProject(name: string, subject: string): Project {
    const newProject = new Project();
    newProject.name = name;
    newProject.subject = subject;
    return newProject;
  }

  addMembers(members: Member[]) {
    if (!this.members) this.members = [];
    this.members = this.members.concat(members);
  }
}
