import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Project } from './entity/project.entity';
import { ProjectToMember } from './entity/project-member.entity';
import { Member } from 'src/member/entity/member.entity';
import { Memo, memoColor } from './entity/memo.entity';
import { MemberRepository } from 'src/member/repository/member.repository';
import { Link } from './entity/link.entity.';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectToMember)
    private readonly projectToMemberRepository: Repository<ProjectToMember>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Memo)
    private readonly memoRepository: Repository<Memo>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
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

  getProjectMemberList(project: Project) {
    return this.memberRepository.find({
      where: { projectToMember: { project: { id: project.id } } },
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

  getProjectMemoListWithMember(projectId: number): Promise<Memo[]> {
    return this.memoRepository.find({
      where: { projectId },
      relations: ['member'],
    });
  }

  createMemo(memo: Memo): Promise<Memo> {
    return this.memoRepository.save(memo);
  }

  async deleteMemo(id: number): Promise<number> {
    const result = await this.memoRepository.delete({ id });
    return result.affected ? result.affected : 0;
  }

  async updateMemoColor(id: number, color: memoColor): Promise<number> {
    const result = await this.memoRepository.update({ id }, { color: color });
    return result.affected ? result.affected : 0;
  }

  async findMemoById(id: number): Promise<Memo> {
    return this.memoRepository.findOne({
      where: { id },
    });
  }

  createLink(link: Link): Promise<Link> {
    return this.linkRepository.save(link);
  }
}
