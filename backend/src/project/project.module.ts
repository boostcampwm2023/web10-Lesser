import { Module } from '@nestjs/common';
import { LesserJwtModule } from 'src/lesser-jwt/lesser-jwt.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './service/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { ProjectToMember } from './entity/project-member.entity';
import { Member } from 'src/member/entity/member.entity';
import { ProjectRepository } from './repository/project.repository';
import { ProjectToMemberRepository } from './repository/project-member.repository';
import { MemberRepository } from 'src/member/repository/member.repository';

@Module({
  imports: [
    LesserJwtModule,
    TypeOrmModule.forFeature([Project, ProjectToMember, Member]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, ProjectToMemberRepository, MemberRepository],
})
export class ProjectModule {}
