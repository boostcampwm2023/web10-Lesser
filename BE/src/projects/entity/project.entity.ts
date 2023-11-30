import { Member } from 'src/members/entities/member.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Project extends BaseEntity {
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
}
