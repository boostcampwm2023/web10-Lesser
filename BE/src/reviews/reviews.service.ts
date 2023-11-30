import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { CreateReviewRequestDto, CreateReviewResponseDto, ReadReviewResponseDto } from './dto/Review.dto';
import { SprintReviewResponseDto } from './dto/SprintReviewResponse.dto';
import { SprintToTask } from 'src/sprints/entities/sprint-task.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Sprint) private sprintRepository: Repository<Sprint>,
    @InjectRepository(SprintToTask) private sprintToTaskRepository: Repository<SprintToTask>,
  ) {}

  async createReview(dto: CreateReviewRequestDto): Promise<CreateReviewResponseDto> {
    const existingReview = await this.reviewRepository.findOne({ where: { sprint: { id: dto.sprintId } } });
    if (existingReview) throw new ConflictException('A review already exists for this sprint.');

    const sprint = await this.sprintRepository.findOne({ where: { id: dto.sprintId } });
    const newReview = this.reviewRepository.create({
      content: dto.content,
      sprint: sprint,
    });
    const savedReview = await this.reviewRepository.save(newReview);
    return { id: savedReview.id };
  }

  async getSprintReview(requestProjectId: number, requestSprintId: number): Promise<SprintReviewResponseDto> {
    const projectId = requestProjectId;
    const sprintList = await this.sprintRepository.find({
      where: { project: { id: projectId }, closed_date: Not(IsNull()) },
      order: { closed_date: 'DESC' },
    });
    if (sprintList.length === 0) throw new NotFoundException('No closed sprints found for this project.');

    const sprintId = Number(requestSprintId) === 0 ? sprintList[0].id : Number(requestSprintId);
    const selectedSprint = await this.sprintRepository.findOne({ where: { id: sprintId } });
    const sprintTasks = await this.sprintToTaskRepository
      .createQueryBuilder('sprintToTask')
      .leftJoinAndSelect('sprintToTask.sprint', 'sprint')
      .leftJoinAndSelect('sprintToTask.task', 'task')
      .leftJoinAndSelect('task.member', 'memberId')
      .where('sprint.id = :sprintId', { sprintId: sprintId })
      .getMany();

    const { completedCount, incompleteCount } = sprintTasks.reduce(
      (acc, sprintTask) => {
        if (sprintTask.completed_at) acc.completedCount += 1;
        else acc.incompleteCount += 1;
        return acc;
      },
      { completedCount: 0, incompleteCount: 0 },
    );

    const taskList = sprintTasks.map((sprintTask) => ({
      id: sprintTask.task.id,
      title: sprintTask.task.title,
      point: sprintTask.task.point,
      condition: sprintTask.task.condition,
      memberId: sprintTask.task.member ? sprintTask.task.member.id : null,
      completedAt: sprintTask.completed_at,
    }));

    const remi = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.sprint', 'sprint')
      .where('sprint.id = :sprintId', { sprintId: sprintId })
      .getOne();

    const response: SprintReviewResponseDto = {
      sprintList: sprintList.map((sprint) => ({ sprintId: sprint.id, title: sprint.title })),
      selectedSprint: {
        id: selectedSprint.id,
        title: selectedSprint.title,
        goal: selectedSprint.goal,
        startDate: selectedSprint.start_date,
        endDate: selectedSprint.end_date,
        closedDate: selectedSprint.closed_date,
        completedCount: completedCount,
        incompleteCount: incompleteCount,
        taskList: taskList,
        remi: remi ? { id: remi.id, content: remi.content } : null,
      },
    };
    return response;
  }

  async readReview(id: number): Promise<ReadReviewResponseDto> {
    const review = await this.reviewRepository.findOne({ where: { id: id } });
    if (!review) throw new NotFoundException('Review not found.');
    return { id: review.id, content: review.content };
  }
}
