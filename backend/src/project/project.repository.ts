import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Project } from './entity/project.entity';
import { ProjectToMember } from './entity/project-member.entity';
import { Member } from 'src/member/entity/member.entity';
import { Memo, memoColor } from './entity/memo.entity';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectToMember)
    private readonly projectToMemberRepository: Repository<ProjectToMember>,
    @InjectRepository(Memo)
    private readonly memoRepository: Repository<Memo>,
  ) {}

  create(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }

  addProjectMember(project: Project, member: Member): Promise<ProjectToMember> {
    return this.projectToMemberRepository.save(
      ProjectToMember.of(project, member),
    );
  }

  getProjectByLinkId(projectLinkId: string): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { inviteLinkId: projectLinkId },
    });
  }

  getProject(projectId: number): Promise<Project | null> {
    return this.projectRepository.findOne({ where: { id: projectId } });
  }

  getProjectList(member: Member): Promise<Project[]> {
    return this.projectRepository.find({
      where: { projectToMember: { member: { id: member.id } } },
      relations: { projectToMember: true },
    });
  }

  getProjectToMember(
    project: Project,
    member: Member,
  ): Promise<ProjectToMember | null> {
    return this.projectToMemberRepository.findOne({
      where: { project: { id: project.id }, member: { id: member.id } },
    });
  }

  createMemo(memo: Memo): Promise<Memo> {
    return this.memoRepository.save(memo);
  }
}
