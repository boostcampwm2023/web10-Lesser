import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { ReviewsController } from './reviews.controller';
import { Sprint } from 'src/sprints/entities/sprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Sprint]), LesserJwtModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
