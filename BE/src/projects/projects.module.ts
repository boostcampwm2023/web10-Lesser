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
import { Member } from 'src/members/domain/entity/member.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { ProjectRepository } from './repository/Project.Repository';
import { ProjectCounterRepository } from './repository/ProjectCounter.Repository';
import { Project } from './Domain/entity/project.entity';
import { ProjectCounter } from './Domain/entity/projectCounter.entity';
import { ProjectsController } from './Controller/projects.controller';
import { ProjectsService } from './Domain/Service/projects.service';
import { MembersModule } from 'src/members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Epic, Story, Task, Member, ProjectCounter, Sprint]),
    LesserJwtModule,
    MembersModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    { provide: 'ProjectRepo', useClass: ProjectRepository },
    { provide: 'ProjectCounterRepo', useClass: ProjectCounterRepository },
  ],
})
export class ProjectsModule {}
