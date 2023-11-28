import { Project } from 'src/projects/entity/project.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

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

  @ManyToMany(() => Project, (Project) => Project.members)
  projects: Project[];
}
