import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Member_Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;
}
