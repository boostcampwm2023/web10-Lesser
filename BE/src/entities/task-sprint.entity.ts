import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Task_Sprint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_complete: boolean;
}
