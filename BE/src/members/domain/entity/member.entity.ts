import { Project } from 'src/projects/Domain/entity/project.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => Project, (Project) => Project.members)
  projects: Project[];

  static createMember(githubId: string, username: string, email: string, imageUrl: string) {
    const newMember = new Member();
    newMember.github_id = githubId;
    newMember.username = username;
    newMember.email = email;
    newMember.image_url = imageUrl;
    return newMember;
  }
}
