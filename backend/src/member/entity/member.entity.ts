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
  github_username: string;

  @Column()
  github_image_url: string;

  @Column()
  username: string;

  @Column()
  position: string;

  @Column('json')
  tech_stack: object;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  static of(
    githubId: number,
    githubUsername: string,
    githubImageUrl: string,
    username: string,
    position: string,
    techStack: object,
  ) {
    const newMember = new Member();
    newMember.github_id = githubId;
    newMember.github_username = githubUsername;
    newMember.github_image_url = githubImageUrl;
    newMember.username = username;
    newMember.position = position;
    newMember.tech_stack = techStack;
    return newMember;
  }
}
