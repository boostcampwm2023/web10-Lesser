import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  github_id: number;

  @Column()
  username: string;

  @Column()
  image_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  static of(
    githubId: number,
    username: string,
    image_url: string,
  ) {
    const newMember = new Member();
    newMember.github_id = githubId;
    newMember.username = username;
    newMember.image_url = image_url;
    return newMember;
  }
}
