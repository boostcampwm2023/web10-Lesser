import { ProjectToMember } from 'src/project/entity/project-member.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'int', unique: true, nullable: false })
  github_id: number;

  @Column({ type: 'varchar', length: 39, nullable: false })
  github_username: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  github_image_url: string;

  @Column({ type: 'varchar', length: 39, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  position: string;

  @Column({ type: 'json', nullable: false })
  tech_stack: { stacks: string[] };

  @OneToMany(() => ProjectToMember, (projectToMember) => projectToMember.member)
  projectToMember: ProjectToMember[];

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
    techStack: { stacks: string[] },
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
