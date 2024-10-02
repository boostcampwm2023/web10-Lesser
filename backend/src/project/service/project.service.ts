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
import { LexoRank } from 'lexorank';
import { MemberRole } from '../enum/MemberRole.enum';
import { v4 as uuidv4 } from 'uuid';
import { ProjectBriefInfoDto } from '../dto/service/ProjectBriefInfo.dto';
import { ProjectJoinRequest } from '../entity/project-join-request.entity';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(member: Member, title: string, subject: string) {
    const createdProject = await this.projectRepository.create(
      Project.of(title, subject),
    );
    await this.projectRepository.addProjectMember(
      createdProject,
      member,
      MemberRole.LEADER,
    );
  }

  async updateProjectInfo(
    project: Project,
    member: Member,
    title: string,
    subject: string,
  ): Promise<boolean> {
    if (!(await this.isProjectLeader(project.id, member))) {
      throw new Error('Member is not the project leader');
    }
    return this.projectRepository.updateProjectInfo(project, title, subject);
  }

  async deleteProject(projectId: number, member: Member): Promise<boolean> {
    if (!(await this.isProjectLeader(projectId, member))) {
      throw new Error('Member is not the project leader');
    }
    const affected = await this.projectRepository.delete(projectId);
    if (affected === 0) return false;
    return true;
  }

  async getProjectList(member: Member): Promise<Project[]> {
    return await this.projectRepository.getProjectList(member);
  }

  private getProjectWithInviteLink(projectId: number) {
    return this.projectRepository.getProject(projectId);
  }
  private async getProjectWithOutInviteLink(projectId: number) {
    const project = await this.projectRepository.getProject(projectId);
    delete project.inviteLinkId;
    return project;
  }

  async updateInviteLink(projectId: number, member: Member): Promise<string> {
    if (!(await this.isProjectLeader(projectId, member))) {
      throw new Error('Member is not the project leader');
    }
    const newInviteLinkId = await uuidv4();
    const isUpdated = await this.projectRepository.updateInviteLink(
      projectId,
      newInviteLinkId,
    );
    if (!isUpdated) throw new Error('invite link not updated');
    return newInviteLinkId;
  }

  async getProject(projectId: number, member: Member): Promise<Project | null> {
    if (!(await this.isExistProject(projectId)))
      throw new Error('Project not found');
    if (!(await this.isProjectMember(projectId, member))) {
      throw new Error('Not project member');
    }
    if (await this.isProjectLeader(projectId, member)) {
      return this.getProjectWithInviteLink(projectId);
    }
    return this.getProjectWithOutInviteLink(projectId);
  }

  async addMember(project: Project, member: Member): Promise<void> {
    const isProjectMember = await this.isProjectMember(project.id, member);
    if (isProjectMember) throw new Error('already joined member');

    if ((await this.getProjectMemberList(project)).length >= 10)
      throw new Error('Project reached its maximum member capacity');

    await this.projectRepository.addProjectMember(
      project,
      member,
      MemberRole.MEMBER,
    );
  }

  async getProjectMemberList(project: Project) {
    return this.projectRepository.getProjectMemberList(project);
  }

  async isExistProject(projectId: number): Promise<boolean> {
    const project = await this.projectRepository.getProject(projectId);
    return !!project;
  }

  async isProjectMember(projectId: number, member: Member): Promise<boolean> {
    const projectToMember: ProjectToMember | null =
      await this.projectRepository.getProjectToMember(projectId, member);
    if (!projectToMember) return false;
    return true;
  }

  async isProjectLeader(projectId: number, member: Member): Promise<boolean> {
    const projectToMember = await this.projectRepository.getProjectToMember(
      projectId,
      member,
    );
    return projectToMember?.role === MemberRole.LEADER;
  }

  async getProjectBriefInfoByInviteLinkId(
    inviteLinkId: string,
  ): Promise<ProjectBriefInfoDto> {
    const project =
      await this.projectRepository.getProjectWithMemberListByLinkId(
        inviteLinkId,
      );
    const leader = project.projectToMember.find(
      (member) => member.role === MemberRole.LEADER,
    );
    if (!leader) {
      throw new Error('Project does not have a leader');
    }
    return ProjectBriefInfoDto.of(
      project.id,
      project.title,
      project.subject,
      leader.member.username,
    );
  }

  getProjectByLinkId(projectLinkId: string): Promise<Project | null> {
    return this.projectRepository.getProjectByLinkId(projectLinkId);
  }

  async createProjectJoinRequest(
    inviteLinkId: string,
    member: Member,
  ): Promise<void> {
    const project = await this.getProjectByLinkId(inviteLinkId);
    if (!project) throw new Error('Project not found');
    const isProjectMember = await this.isProjectMember(project.id, member);
    if (isProjectMember) throw new Error('Already a project member');
    try {
      const newProjectJoinRequest = ProjectJoinRequest.of(
        project.id,
        member.id,
      );
      await this.projectRepository.createProjectJoinRequest(
        newProjectJoinRequest,
      );
    } catch (e) {
      if (e.message === 'DUPLICATED PROJECT ID AND MEMBER ID') {
        throw new Error('Join request already submitted');
      }
    }
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

  private async getAdjustedRankValue(
    currentRankValue: string,
    nextRankValue: string | null,
  ): Promise<string> {
    if (!nextRankValue) {
      return LexoRank.parse(currentRankValue).genNext().toString();
    } else {
      const nextRank = LexoRank.parse(nextRankValue);
      return LexoRank.parse(currentRankValue).between(nextRank).toString();
    }
  }

  async createEpic(
    project: Project,
    name: string,
    color: EpicColor,
    rankValue: string,
  ) {
    const maxRetries = 10;
    let attempts = 0;
    const newEpic = Epic.of(project, name, color, rankValue);
    while (attempts < maxRetries) {
      try {
        return await this.projectRepository.createEpic(newEpic);
      } catch (e) {
        if (e.message === 'DUPLICATED RANK VALUE') {
          const nextEpic = await this.projectRepository.getNextEpicByRankValue(
            newEpic.projectId,
            newEpic.rankValue,
          );
          newEpic.rankValue = await this.getAdjustedRankValue(
            newEpic.rankValue,
            nextEpic?.rankValue,
          );
          attempts++;
          if (attempts === 10) throw e;
        } else throw e;
      }
    }
  }

  async deleteEpic(project: Project, epicId: number) {
    const result = await this.projectRepository.deleteEpic(project, epicId);
    return result ? true : false;
  }

  async updateEpic(
    project: Project,
    id: number,
    name?: string,
    color?: EpicColor,
    rankValue?: string,
  ) {
    const maxRetries = 10;
    let attempts = 0;

    let updatedRankValue = rankValue;

    while (attempts < maxRetries) {
      try {
        return {
          isUpdated: await this.projectRepository.updateEpic(
            project,
            id,
            name,
            color,
            updatedRankValue,
          ),
          updatedRankValue,
        };
      } catch (e) {
        if (e.message === 'DUPLICATED RANK VALUE') {
          const nextEpic = await this.projectRepository.getNextEpicByRankValue(
            project.id,
            updatedRankValue,
          );
          updatedRankValue = await this.getAdjustedRankValue(
            updatedRankValue,
            nextEpic?.rankValue,
          );
          attempts++;
          if (attempts === 10) throw e;
        } else throw e;
      }
    }
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

    const maxRetries = 10;
    let attempts = 0;
    const newStory = Story.of(project, epicId, title, point, status, rankValue);
    while (attempts < maxRetries) {
      try {
        return await this.projectRepository.createStory(newStory);
      } catch (e) {
        if (e.message === 'DUPLICATED RANK VALUE') {
          const nextStory =
            await this.projectRepository.getNextStoryByRankValue(
              newStory.projectId,
              newStory.rankValue,
            );
          newStory.rankValue = await this.getAdjustedRankValue(
            newStory.rankValue,
            nextStory?.rankValue,
          );

          attempts++;
          if (attempts === 10) throw e;
        } else throw e;
      }
    }
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
  ) {
    if (epicId !== undefined) {
      const epic = await this.projectRepository.getEpicById(project, epicId);
      if (!epic) throw new Error('epic id not found');
    }

    const maxRetries = 10;
    let attempts = 0;

    let updatedRankValue = rankValue;

    while (attempts < maxRetries) {
      try {
        return {
          isUpdated: await this.projectRepository.updateStory(
            project,
            id,
            epicId,
            title,
            point,
            status,
            updatedRankValue,
          ),
          updatedRankValue,
        };
      } catch (e) {
        if (e.message === 'DUPLICATED RANK VALUE') {
          const nextStory =
            await this.projectRepository.getNextStoryByRankValue(
              project.id,
              updatedRankValue,
            );

          updatedRankValue = await this.getAdjustedRankValue(
            updatedRankValue,
            nextStory?.rankValue,
          );
          attempts++;
          if (attempts === maxRetries) throw e;
        } else throw e;
      }
    }
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

    const maxRetries = 10;
    let attempts = 0;
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
    while (attempts < maxRetries) {
      try {
        return await this.projectRepository.createTask(newTask);
      } catch (e) {
        if (e.message === 'DUPLICATED RANK VALUE') {
          const nextTask = await this.projectRepository.getNextTaskByRankValue(
            newTask.storyId,
            newTask.rankValue,
          );
          newTask.rankValue = await this.getAdjustedRankValue(
            newTask.rankValue,
            nextTask?.rankValue,
          );

          attempts++;
          if (attempts === 10) throw e;
        } else throw e;
      }
    }
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
  ) {
    if (storyId !== undefined) {
      const story = await this.projectRepository.getStoryById(project, storyId);
      if (!story) throw new Error('story id not found');
    }

    const maxRetries = 10;
    let attempts = 0;

    let updatedRankValue = rankValue;

    while (attempts < maxRetries) {
      try {
        return {
          isUpdated: await this.projectRepository.updateTask(
            project,
            id,
            storyId,
            title,
            expectedTime,
            actualTime,
            status,
            assignedMemberId,
            updatedRankValue,
          ),
          updatedRankValue,
        };
      } catch (e) {
        if (e.message === 'DUPLICATED RANK VALUE') {
          const nextTask = await this.projectRepository.getNextTaskByRankValue(
            project.id,
            updatedRankValue,
          );

          updatedRankValue = await this.getAdjustedRankValue(
            updatedRankValue,
            nextTask?.rankValue,
          );
          attempts++;
          if (attempts === maxRetries) throw e;
        } else throw e;
      }
    }
  }

  getProjectBacklog(project: Project) {
    return this.projectRepository.getProjectBacklog(project);
  }
}
