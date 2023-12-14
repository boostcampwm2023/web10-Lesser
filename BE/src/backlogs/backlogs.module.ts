import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { Member } from 'src/members/entities/member.entity';
import { Project } from 'src/projects/Domain/entity/project.entity';
import { ProjectCounter } from 'src/projects/Domain/entity/projectCounter.entity';
import { BacklogsController } from './backlogs.controller';
import { BacklogsService } from './backlogs.service';
import { BacklogsAuthService } from './backlogsAuth.service';
import { SprintToTask } from 'src/sprints/entities/sprint-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Epic, Story, Task, Project, Member, ProjectCounter, SprintToTask]), LesserJwtModule],
  controllers: [BacklogsController],
  providers: [BacklogsService, BacklogsAuthService],
})
export class BacklogsModule {}
