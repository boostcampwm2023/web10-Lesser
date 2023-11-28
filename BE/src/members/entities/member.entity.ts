import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  github_id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  image_url: string;
}
