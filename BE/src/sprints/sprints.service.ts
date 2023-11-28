import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entity/project.entity';
import { CreateSprintRequestDto, CreateSprintResponseDto } from './dto/Sprint.dto';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { Review } from 'src/reviews/entities/review.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint) private sprintRepository: Repository<Sprint>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  async createSprint(
    dto: CreateSprintRequestDto,
    // memberInfo: memberDecoratorType,
  ): Promise<CreateSprintResponseDto> {
    // const member = await this.memberRepository.findOne({ where: { id: memberInfo.id } });
    // if (!member) throw new InternalServerErrorException();
    const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
    const newSprint = this.sprintRepository.create({
      title: dto.title,
      goal: dto.goal,
      start_date: dto.startDate,
      end_date: dto.endDate,
      project: project,
    });
    const savedSprint = await this.sprintRepository.save(newSprint);
    return { id: savedSprint.id };
  }
}
