import { Member } from 'src/members/entities/member.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  subject: string;

  @ManyToMany(() => Member)
  @JoinTable()
  members: Member[];
}
