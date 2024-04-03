import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../repository/project.repository';
import { ProjectToMemberRepository } from '../repository/project-member.repository';
import { Member } from 'src/member/entity/member.entity';
import { Project } from '../entity/project.entity';
import { ProjectToMember } from '../entity/project-member.entity';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectToMemberRepository: ProjectToMemberRepository,
  ) {}

  async createProject(member: Member, title: string, subject: string) {
    const createdProject = await this.projectRepository.create(
      Project.of(title, subject),
    );
    console.log(createdProject)
    console.log(member)
    const res = await this.projectToMemberRepository.create(
      ProjectToMember.of(createdProject, member),
    );
    console.log(res)
  }
}
