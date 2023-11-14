import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Story extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
