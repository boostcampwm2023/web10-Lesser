import { Module } from '@nestjs/common';
import { LesserJwtModule } from 'src/lesser-jwt/lesser-jwt.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './service/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/entity/project.entity';
import { ProjectToMember } from 'src/project/entity/project-member.entity';
import { Member } from 'src/member/entity/member.entity';
import { ProjectRepository } from './project.repository';
import { MemberRepository } from 'src/member/repository/member.repository';
import { ProjectWebsocketGateway } from './websocket.gateway';

@Module({
  imports: [
    LesserJwtModule,
    TypeOrmModule.forFeature([Project, ProjectToMember, Member]),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
    MemberRepository,
    ProjectWebsocketGateway,
  ],
})
export class ProjectModule {}
