import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { Project } from 'src/projects/entity/project.entity';
import { Repository } from 'typeorm';
import { Epic } from './entities/epic.entity';
import { Story } from './entities/story.entity';
import { Task } from './entities/task.entity';

@Injectable()
export class BacklogsAuthService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  async checkProjectAuth(projectId: number, memberInfo: memberDecoratorType) {
    const queryData = await this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.members', 'member')
      .where('project.id = :projectId', { projectId })
      .andWhere('member.id = :memberId', { memberId: memberInfo.id })
      .getOne();
    if (queryData === null) throw new ForbiddenException();
  }
  async checkEpicAuth(epicId: number, memberInfo: memberDecoratorType) {
    const queryData = await this.epicRepository
      .createQueryBuilder('epic')
      .innerJoin('epic.project', 'project')
      .innerJoin('project.members', 'member')
      .where('epic.id = :epicId', { epicId })
      .andWhere('member.id = :memberId', { memberId: memberInfo.id })
      .getOne();
    if (queryData === null) throw new ForbiddenException();
  }
  async checkStoryAuth(storyId: number, memberInfo: memberDecoratorType) {
    const queryData = await this.storyRepository
      .createQueryBuilder('story')
      .innerJoin('story.epic', 'epic')
      .innerJoin('epic.project', 'project')
      .innerJoin('project.members', 'member')
      .where('story.id = :storyId', { storyId })
      .andWhere('member.id = :memberId', { memberId: memberInfo.id })
      .getOne();
    if (queryData === null) throw new ForbiddenException();
  }
  async checkTaskAuth(taskId: number, memberInfo: memberDecoratorType) {
    const queryData = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoin('task.story', 'story')
      .innerJoin('story.epic', 'epic')
      .innerJoin('epic.project', 'project')
      .innerJoin('project.members', 'member')
      .where('task.id = :taskId', { taskId })
      .andWhere('member.id = :memberId', { memberId: memberInfo.id })
      .getOne();
    if (queryData === null) throw new ForbiddenException();
  }
}
