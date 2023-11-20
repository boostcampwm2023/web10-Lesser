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

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => Story, (Story) => Story.id, { nullable: false, onDelete: 'CASCADE' })
  story: Story;
}
