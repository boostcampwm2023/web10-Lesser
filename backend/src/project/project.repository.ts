import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Project } from './entity/project.entity';
import { ProjectToMember } from './entity/project-member.entity';
import { Member } from 'src/member/entity/member.entity';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectToMember)
    private readonly projectToMemberRepository: Repository<ProjectToMember>,
  ) {}

  create(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }

  addProjectMember(project: Project, member: Member): Promise<ProjectToMember> {
    return this.projectToMemberRepository.save(
      ProjectToMember.of(project, member),
    );
  }
}
