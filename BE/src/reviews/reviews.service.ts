import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { CreateReviewRequestDto, CreateReviewResponseDto } from './dto/Review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Sprint) private sprintRepository: Repository<Sprint>,
  ) {}

  async createReview(
    dto: CreateReviewRequestDto,
    // memberInfo: memberDecoratorType,
  ): Promise<CreateReviewResponseDto> {
    // const member = await this.memberRepository.findOne({ where: { id: memberInfo.id } });
    // if (!member) throw new InternalServerErrorException();
    const sprint = await this.sprintRepository.findOne({ where: { id: dto.sprintId } });
    const newReview = this.reviewRepository.create({
      content: dto.content,
      sprint: sprint,
    });
    const savedReview = await this.sprintRepository.save(newReview);
    return { id: savedReview.id };
  }
}
