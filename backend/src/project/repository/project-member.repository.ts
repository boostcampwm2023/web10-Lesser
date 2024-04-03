import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Project } from '../entity/project.entity';
import { ProjectToMember } from '../entity/project-member.entity';
import { Member } from 'src/member/entity/member.entity';

@Injectable()
export class ProjectToMemberRepository {
  constructor(
    @InjectRepository(ProjectToMember)
    private readonly projectToMemberRepository: Repository<ProjectToMember>,
  ) {}

  create(projectToMember: ProjectToMember): Promise<ProjectToMember> {
    return this.projectToMemberRepository.save(projectToMember);
  }
}
