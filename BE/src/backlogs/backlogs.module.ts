import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { Project } from 'src/projects/entity/project.entity';
import { BacklogsController } from './backlogs.controller';
import { BacklogsService } from './backlogs.service';
import { BacklogsAuthService } from './backlogsAuth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Epic, Story, Task, Project]), LesserJwtModule],
  controllers: [BacklogsController],
  providers: [BacklogsService, BacklogsAuthService],
})
export class BacklogsModule {}
