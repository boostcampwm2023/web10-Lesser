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
    const project = await this.projectRepository.findOne({ where: { id: projectId }, relations: ['members'] });
    if (project === null) throw new NotFoundException(`Project with ID ${projectId} not found`);
    const isMember = project.members.some((member) => member.id === memberInfo.id);
    if (!isMember) throw new ForbiddenException();
  }
  async checkEpicAuth(epicId: number, memberInfo: memberDecoratorType) {
    // await this.epicRepository();
  }
  async checkStoryAuth(storyId: number, memberInfo: memberDecoratorType) {}
  async checkTaskAuth(taskId: number, memberInfo: memberDecoratorType) {}
}
