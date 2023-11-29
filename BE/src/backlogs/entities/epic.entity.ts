import { Project } from 'src/projects/entity/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';

@Entity()
export class Epic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  sequence: number;

  @ManyToOne(() => Project, (Project) => Project.id, { nullable: false, onDelete: 'CASCADE' })
  project: Project;
}
