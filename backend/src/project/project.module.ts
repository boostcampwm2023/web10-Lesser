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
import { Memo } from './entity/memo.entity';
import { MemberService } from 'src/member/service/member.service';
import { Link } from './entity/link.entity.';
import { WsProjectMemoController } from './ws-controller/ws-project-memo.controller';
import { WsProjectMemberController } from './ws-controller/ws-project-member.controller';
import { WsProjectLinkController } from './ws-controller/ws-project-link.controller';
import { WsProjectController } from './ws-controller/ws-project.controller';
import { WsProjectEpicController } from './ws-controller/ws-project-epic.controller';
import { Epic } from './entity/epic.entity';
import { Story } from './entity/story.entity';
import { WsProjectStoryController } from './ws-controller/ws-project-story.controller';
import { Task } from './entity/task.entity';
import { WsProjectTaskController } from './ws-controller/ws-project-task.controller';
import { WsProjectInfoController } from './ws-controller/ws-project-info.controller';

@Module({
  imports: [
    LesserJwtModule,
    TypeOrmModule.forFeature([
      Project,
      ProjectToMember,
      Member,
      Memo,
      Link,
      Epic,
      Story,
      Task,
    ]),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
    MemberService,
    MemberRepository,
    ProjectWebsocketGateway,
    WsProjectMemoController,
    WsProjectMemberController,
    WsProjectLinkController,
    WsProjectController,
    WsProjectEpicController,
    WsProjectStoryController,
    WsProjectTaskController,
    WsProjectInfoController,
  ],
})
export class ProjectModule {}
