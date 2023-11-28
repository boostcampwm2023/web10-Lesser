import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Module({
  providers: [ReviewsService]
})
export class ReviewsModule {}
