import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { AuthModule } from 'src/common/auth/auth.module';
import { IsLoginGuard } from 'src/common/auth/IsLogin.guard';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { LesserJwtService } from 'src/common/lesser-jwt/lesser-jwt.service';
import { Member } from 'src/members/entities/member.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { Project } from './entity/project.entity';
import { ProjectCounter } from './entity/projectCounter.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Epic, Story, Task, Member, ProjectCounter, Sprint]), LesserJwtModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
