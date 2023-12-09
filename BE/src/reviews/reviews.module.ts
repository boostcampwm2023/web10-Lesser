import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { ReviewsController } from './reviews.controller';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { SprintToTask } from 'src/sprints/entities/sprint-task.entity';
import { Member } from 'src/members/entities/member.entity';
import { Project } from 'src/projects/Domain/entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Project, Sprint, Member, Task, SprintToTask]), LesserJwtModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
