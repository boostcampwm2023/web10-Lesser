import { Member } from 'src/members/domain/entity/member.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Story } from './story.entity';
import { SprintToTask } from 'src/sprints/entities/sprint-task.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  state: string;

  @Column()
  point: number;

  @Column()
  condition: string;

  @Column()
  sequence: number;

  @ManyToOne(() => Member, (Member) => Member.id, { nullable: true })
  member: Member;

  @ManyToOne(() => Story, (Story) => Story.id, { nullable: false, onDelete: 'CASCADE' })
  story: Story;

  @OneToMany(() => SprintToTask, (sprintToTask) => sprintToTask.task)
  sprintToTasks?: SprintToTask[];
}
