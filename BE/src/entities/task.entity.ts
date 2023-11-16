import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Epic } from './epic.entity';
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

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => Epic, (Epic) => Epic.id, { nullable: false })
  epic: Epic;

  @ManyToOne(() => Story, (Story) => Story.id, { nullable: false })
  story: Story;
}
