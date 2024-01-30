import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/Domain/entity/project.entity';
import { CompleteSprintRequestDto, CreateSprintRequestDto, CreateSprintResponseDto } from './dto/Sprint.dto';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { Review } from 'src/reviews/entities/review.entity';
import { Member } from 'src/members/domain/entity/member.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { SprintToTask } from './entities/sprint-task.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint) private sprintRepository: Repository<Sprint>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(SprintToTask) private sprintToTaskRepository: Repository<SprintToTask>,
  ) {}

  async createSprint(dto: CreateSprintRequestDto, memberInfo: memberDecoratorType): Promise<CreateSprintResponseDto> {
    const member = await this.memberRepository.findOne({ where: { id: memberInfo.id } });
    if (!member) throw new InternalServerErrorException();

    const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
    const tasks = await this.taskRepository.createQueryBuilder('task').whereInIds(dto.taskList).getMany();
    if (tasks.length !== dto.taskList.length) throw new BadRequestException('Reqeust includes invalid task id.');

    const newSprint = this.sprintRepository.create({
      title: dto.title,
      goal: dto.goal,
      start_date: dto.startDate,
      end_date: dto.endDate,
      project: project,
    });
    const savedSprint = await this.sprintRepository.save(newSprint);

    const sprintToTasks = tasks.map((task) => {
      const sprintToTask = this.sprintToTaskRepository.create({
        sprint: savedSprint,
        task: task,
      });
      return sprintToTask;
    });
    await this.sprintToTaskRepository.save(sprintToTasks);

    return { id: savedSprint.id };
  }

  async completeSprint(dto: CompleteSprintRequestDto) {
    const sprint = await this.sprintRepository.findOne({ where: { id: dto.id } });
    if (sprint === null) throw new NotFoundException('not found sprint');
    sprint.closed_date = new Date();
    await sprint.save();
  }
}
