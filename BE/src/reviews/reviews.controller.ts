import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewRequestDto, UpdateReviewRequestDto } from './dto/Review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post()
  createReview(@Body() body: CreateReviewRequestDto) {
    return this.reviewService.createReview(body);
  }

  @Get()
  getSprintReview(@Query('project') projectId: number, @Query('sprint') sprintId: number) {
    return this.reviewService.getSprintReview(projectId, sprintId);
  }

  @Get('remi')
  readReview(@Query('id') reviewId: number) {
    return this.reviewService.readReview(reviewId);
  }

  @Put('remi')
  updateReview(@Body() body: UpdateReviewRequestDto) {
    return this.reviewService.updateReview(body);
  }
}
