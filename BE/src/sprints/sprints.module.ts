import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/projects/entity/project.entity';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { SprintsController } from './sprints.controller';
import { Sprint } from './entities/sprint.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, Project, Review]), LesserJwtModule],
  controllers: [SprintsController],
  providers: [SprintsService],
})
export class SprintsModule {}
