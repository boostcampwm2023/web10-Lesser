import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Epic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
