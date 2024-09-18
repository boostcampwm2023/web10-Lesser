import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Project } from './entity/project.entity';
import { ProjectToMember } from './entity/project-member.entity';
import { Member } from 'src/member/entity/member.entity';
import { Memo, memoColor } from './entity/memo.entity';
import { Link } from './entity/link.entity.';
import { Epic, EpicColor } from './entity/epic.entity';
import { Story, StoryStatus } from './entity/story.entity';
import { Task, TaskStatus } from './entity/task.entity';
import { MemberRole } from './enum/MemberRole.enum';

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
    @InjectRepository(Epic)
    private readonly epicRepository: Repository<Epic>,
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  create(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }

  async updateProjectInfo(
    project: Project,
    title: string,
    subject: string,
  ): Promise<boolean> {
    const updateData: Partial<Project> = {};

    if (title !== undefined) {
      updateData.title = title;
    }
    if (subject !== undefined) {
      updateData.subject = subject;
    }

    const result = await this.projectRepository.update(
      {
        id: project.id,
      },
      updateData,
    );
    return !!result.affected;
  }

  addProjectMember(
    project: Project,
    member: Member,
    role: MemberRole,
  ): Promise<ProjectToMember> {
    return this.projectToMemberRepository.save(
      ProjectToMember.of(project, member, role),
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
    projectId: number,
    member: Member,
  ): Promise<ProjectToMember | null> {
    return this.projectToMemberRepository.findOne({
      where: { project: { id: projectId }, member: { id: member.id } },
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

  getProjectLinkList(project: Project): Promise<Link[]> {
    return this.linkRepository.find({ where: { project: { id: project.id } } });
  }

  async deleteLink(project: Project, id: number): Promise<number> {
    const result = await this.linkRepository.delete({
      project: { id: project.id },
      id,
    });
    return result.affected ? result.affected : 0;
  }

  async createEpic(epic: Epic): Promise<Epic> {
    try {
      return await this.epicRepository.save(epic);
    } catch (e) {
      if (
        e.code === 'ER_DUP_ENTRY' &&
        e.sqlMessage.includes('EPIC_UQ_RANK_VALUE_AND_PROJECT_ID')
      )
        throw new Error('DUPLICATED RANK VALUE');
      throw e;
    }
  }

  getNextEpicByRankValue(projectId: number, rankValue: string) {
    return this.epicRepository.findOne({
      where: {
        projectId,
        rankValue: MoreThan(rankValue),
      },
      order: { rankValue: 'ASC' },
    });
  }

  async deleteEpic(project: Project, epicId: number): Promise<number> {
    const result = await this.epicRepository.delete({
      project: { id: project.id },
      id: epicId,
    });
    return result.affected ? result.affected : 0;
  }

  async updateEpic(
    project: Project,
    id: number,
    name?: string,
    color?: EpicColor,
    rankValue?: string,
  ): Promise<boolean> {
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (color !== undefined) {
      updateData.color = color;
    }

    if (rankValue !== undefined) {
      updateData.rankValue = rankValue;
    }

    try {
      const result = await this.epicRepository.update(
        { id, project: { id: project.id } },
        updateData,
      );
      return !!result.affected;
    } catch (e) {
      if (
        e.code === 'ER_DUP_ENTRY' &&
        e.sqlMessage.includes('EPIC_UQ_RANK_VALUE_AND_PROJECT_ID')
      )
        throw new Error('DUPLICATED RANK VALUE');
      throw e;
    }
  }

  getEpicById(project: Project, id: number) {
    return this.epicRepository.findOne({
      where: { id: id, projectId: project.id },
    });
  }

  async createStory(story: Story): Promise<Story> {
    try {
      return await this.storyRepository.save(story);
    } catch (e) {
      if (
        e.code === 'ER_DUP_ENTRY' &&
        e.sqlMessage.includes('STORY_UQ_RANK_VALUE_AND_PROJECT_ID')
      )
        throw new Error('DUPLICATED RANK VALUE');
      throw e;
    }
  }

  getNextStoryByRankValue(projectId: number, rankValue: string) {
    return this.storyRepository.findOne({
      where: {
        projectId,
        rankValue: MoreThan(rankValue),
      },
      order: { rankValue: 'ASC' },
    });
  }

  async deleteStory(project: Project, storyId: number): Promise<number> {
    const result = await this.storyRepository.delete({
      project: { id: project.id },
      id: storyId,
    });
    return result.affected ? result.affected : 0;
  }

  async updateStory(
    project: Project,
    id: number,
    epicId: number | undefined,
    title: string | undefined,
    point: number | undefined,
    status: StoryStatus | undefined,
    rankValue: string | undefined,
  ): Promise<boolean> {
    const updateData: any = {};

    if (epicId !== undefined) {
      updateData.epicId = epicId;
    }
    if (title !== undefined) {
      updateData.title = title;
    }
    if (point !== undefined) {
      updateData.point = point;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (rankValue !== undefined) {
      updateData.rankValue = rankValue;
    }

    try {
      const result = await this.storyRepository.update(
        { id, project: { id: project.id } },
        updateData,
      );
      return !!result.affected;
    } catch (e) {
      if (
        e.code === 'ER_DUP_ENTRY' &&
        e.sqlMessage.includes('STORY_UQ_RANK_VALUE_AND_PROJECT_ID')
      )
        throw new Error('DUPLICATED RANK VALUE');
      throw e;
    }
  }

  getStoryById(project: Project, id: number) {
    return this.storyRepository.findOne({
      where: { id: id, projectId: project.id },
    });
  }

  async getAndIncrementDisplayIdCount(project: Project) {
    const targetProject = await this.projectRepository.findOne({
      where: { id: project.id },
    });
    await this.projectRepository.update(project.id, {
      displayIdCount: targetProject.displayIdCount + 1,
    });
    return targetProject.displayIdCount;
  }

  async createTask(task: Task): Promise<Task> {
    try {
      return await this.taskRepository.save(task);
    } catch (e) {
      if (
        e.code === 'ER_DUP_ENTRY' &&
        e.sqlMessage.includes('TASK_UQ_RANK_VALUE_AND_STORY_ID')
      )
        throw new Error('DUPLICATED RANK VALUE');
      throw e;
    }
  }

  getNextTaskByRankValue(storyId: number, rankValue: string) {
    return this.taskRepository.findOne({
      where: {
        storyId,
        rankValue: MoreThan(rankValue),
      },
      order: { rankValue: 'ASC' },
    });
  }

  async deleteTask(project: Project, taskId: number): Promise<number> {
    const result = await this.taskRepository.delete({
      project: { id: project.id },
      id: taskId,
    });
    return result.affected ? result.affected : 0;
  }

  async updateTask(
    project: Project,
    id: number,
    storyId: number | undefined,
    title: string | undefined,
    expectedTime: number | undefined,
    actualTime: number | undefined,
    status: TaskStatus | undefined,
    assignedMemberId: number | undefined,
    rankValue: string | undefined,
  ): Promise<boolean> {
    const updateData: any = {};

    if (storyId !== undefined) {
      updateData.storyId = storyId;
    }
    if (title !== undefined) {
      updateData.title = title;
    }
    if (expectedTime !== undefined) {
      updateData.expectedTime = expectedTime;
    }
    if (actualTime !== undefined) {
      updateData.actualTime = actualTime;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (assignedMemberId !== undefined) {
      updateData.assignedMemberId = assignedMemberId;
    }
    if (rankValue !== undefined) {
      updateData.rankValue = rankValue;
    }

    try {
      const result = await this.taskRepository.update(
        { id, project: { id: project.id } },
        updateData,
      );
      return !!result.affected;
    } catch (e) {
      if (
        e.code === 'ER_DUP_ENTRY' &&
        e.sqlMessage.includes('TASK_UQ_RANK_VALUE_AND_STORY_ID')
      )
        throw new Error('DUPLICATED RANK VALUE');
      throw e;
    }
  }

  getProjectBacklog(project: Project) {
    return this.epicRepository.find({
      where: { project: { id: project.id } },
      relations: ['storyList', 'storyList.taskList'],
    });
  }
}
