import { Body, Controller, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewRequestDto } from './dto/Review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post()
  createReview(@Body() body: CreateReviewRequestDto) {
    return this.reviewService.createReview(body);
  }
}
