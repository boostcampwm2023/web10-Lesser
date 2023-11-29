import { Member } from 'src/members/entities/member.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Story } from './story.entity';

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

  @ManyToOne(() => Member, (Member) => Member.id, { nullable: true })
  member: Member;

  @ManyToOne(() => Story, (Story) => Story.id, { nullable: false, onDelete: 'CASCADE' })
  story: Story;
}
