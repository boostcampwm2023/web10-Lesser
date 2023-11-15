import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Epic } from './epic.entity';

@Entity()
export class Story extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Epic, (Epic) => Epic.id, { cascade: true, nullable: false })
  epic: Epic;
}
