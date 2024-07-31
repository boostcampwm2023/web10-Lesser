import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../project.repository';
import { Member } from 'src/member/entity/member.entity';
import { Project } from '../entity/project.entity';
import { ProjectToMember } from '../entity/project-member.entity';
import { Memo, memoColor } from '../entity/memo.entity';
import { Link } from '../entity/link.entity.';
import { Epic, EpicColor } from '../entity/epic.entity';
import { Story, StoryStatus } from '../entity/story.entity';
import { Task, TaskStatus } from '../entity/task.entity';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(member: Member, title: string, subject: string) {
    const createdProject = await this.projectRepository.create(
      Project.of(title, subject),
    );
    await this.projectRepository.addProjectMember(createdProject, member);
  }

  async getProjectList(member: Member): Promise<Project[]> {
    return await this.projectRepository.getProjectList(member);
  }

  async getProject(projectId: number): Promise<Project | null> {
    return await this.projectRepository.getProject(projectId);
  }

  async addMember(project: Project, member: Member): Promise<void> {
    const isProjectMember = await this.isProjectMember(project, member);
    if (isProjectMember) throw new Error('already joined member');

    if ((await this.getProjectMemberList(project)).length >= 10)
      throw new Error('Project reached its maximum member capacity');

    await this.projectRepository.addProjectMember(project, member);
  }

  async getProjectMemberList(project: Project) {
    return this.projectRepository.getProjectMemberList(project);
  }

  async isProjectMember(project: Project, member: Member): Promise<boolean> {
    const projectToMember: ProjectToMember | null =
      await this.projectRepository.getProjectToMember(project, member);
    if (!projectToMember) return false;
    return true;
  }

  getProjectByLinkId(projectLinkId: string): Promise<Project | null> {
    return this.projectRepository.getProjectByLinkId(projectLinkId);
  }

  async createMemo(project: Project, member: Member, color: memoColor) {
    const newMemo = Memo.of(project, member, '', '', color);
    return this.projectRepository.createMemo(newMemo);
  }

  //ToDo: 메모 접근권한 확인 필요
  async deleteMemo(id: number): Promise<boolean> {
    const result = await this.projectRepository.deleteMemo(id);
    if (result) return true;
    else return false;
  }

  getProjectMemoListWithMember(projectId: number): Promise<Memo[]> {
    return this.projectRepository.getProjectMemoListWithMember(projectId);
  }
  async updateMemoColor(
    project: Project,
    id: number,
    color: memoColor,
  ): Promise<boolean> {
    const memo = await this.projectRepository.findMemoById(id);
    if (!memo) return false;
    if (memo.projectId !== project.id)
      throw new Error('project does not have this memo');
    await this.projectRepository.updateMemoColor(id, color);
    return true;
  }

  createLink(project: Project, url: string, description: string) {
    const newLink = Link.of(project, url, description);
    return this.projectRepository.createLink(newLink);
  }

  getProjectLinkList(project: Project) {
    return this.projectRepository.getProjectLinkList(project);
  }

  async deleteLink(project: Project, linkId: number) {
    const result = await this.projectRepository.deleteLink(project, linkId);
    return result ? true : false;
  }

  createEpic(
    project: Project,
    name: string,
    color: EpicColor,
    rankValue: string,
  ) {
    const newEpic = Epic.of(project, name, color, rankValue);
    return this.projectRepository.createEpic(newEpic);
  }

  async deleteEpic(project: Project, epicId: number) {
    const result = await this.projectRepository.deleteEpic(project, epicId);
    return result ? true : false;
  }

  updateEpic(
    project: Project,
    id: number,
    name?: string,
    color?: EpicColor,
    rankValue?: string,
  ): Promise<boolean> {
    return this.projectRepository.updateEpic(
      project,
      id,
      name,
      color,
      rankValue,
    );
  }

  async createStory(
    project: Project,
    epicId: number,
    title: string,
    point: number,
    status: StoryStatus,
    rankValue: string,
  ) {
    const epic = await this.projectRepository.getEpicById(project, epicId);
    if (!epic) throw new Error('epic id not found');
    const newStory = Story.of(project, epicId, title, point, status, rankValue);
    return this.projectRepository.createStory(newStory);
  }

  async deleteStory(project: Project, storyId: number) {
    const result = await this.projectRepository.deleteStory(project, storyId);
    return result ? true : false;
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
    if (epicId !== undefined) {
      const epic = await this.projectRepository.getEpicById(project, epicId);
      if (!epic) throw new Error('epic id not found');
    }
    return this.projectRepository.updateStory(
      project,
      id,
      epicId,
      title,
      point,
      status,
      rankValue,
    );
  }

  async createTask(
    project: Project,
    title: string,
    expectedTime: number,
    actualTime: number,
    status: TaskStatus,
    assignedMemberId: number,
    storyId: number,
    rankValue: string,
  ) {
    const story = await this.projectRepository.getStoryById(project, storyId);
    if (!story) throw new Error('Story id not found');
    const displayIdCount =
      await this.projectRepository.getAndIncrementDisplayIdCount(project);

    const newTask = Task.of(
      project,
      storyId,
      title,
      displayIdCount,
      expectedTime,
      actualTime,
      assignedMemberId,
      status,
      rankValue,
    );
    return this.projectRepository.createTask(newTask);
  }

  async deleteTask(project: Project, taskId: number) {
    const result = await this.projectRepository.deleteTask(project, taskId);
    return result ? true : false;
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
    if (storyId !== undefined) {
      const story = await this.projectRepository.getStoryById(project, storyId);
      if (!story) throw new Error('story id not found');
    }
    return this.projectRepository.updateTask(
      project,
      id,
      storyId,
      title,
      expectedTime,
      actualTime,
      status,
      assignedMemberId,
      rankValue,
    );
  }

  getProjectBacklog(project: Project) {
    return this.projectRepository.getProjectBacklog(project);
  }
}
