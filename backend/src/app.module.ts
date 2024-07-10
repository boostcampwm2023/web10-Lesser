import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LesserConfigModule } from './lesser-config/lesser-config.module';
import { GithubApiModule } from './github-api/github-api.module';
import {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} from './lesser-config/constants';
import { LesserJwtModule } from './lesser-jwt/lesser-jwt.module';
import { TempMember } from './auth/entity/tempMember.entity';
import { MemberModule } from './member/member.module';
import { Member } from './member/entity/member.entity';
import { LoginMember } from './auth/entity/loginMember.entity';
import { Project } from './project/entity/project.entity';
import { ProjectToMember } from './project/entity/project-member.entity';
import { ProjectModule } from './project/project.module';
import * as cookieParser from 'cookie-parser';
import { BearerTokenMiddleware } from './common/middleware/parse-bearer-token.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorExceptionFilter } from './common/exception-filter/exception.filter';
import { AuthenticationGuard } from './common/guard/authentication.guard';
import { MemberRepository } from './member/repository/member.repository';
import { Memo } from './project/entity/memo.entity';
import { Link } from './project/entity/link.entity.';
import { Epic } from './project/entity/epic.entity';
import { Story } from './project/entity/story.entity';
import { Task } from './project/entity/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get(DATABASE_HOST),
        port: +ConfigService.get(DATABASE_PORT),
        username: ConfigService.get(DATABASE_USER),
        password: ConfigService.get(DATABASE_PASSWORD),
        database: ConfigService.get(DATABASE_NAME),
        entities: [
          Member,
          TempMember,
          LoginMember,
          Project,
          ProjectToMember,
          Memo,
          Link,
          Epic,
          Story,
		  Task
        ],
        synchronize: ConfigService.get('NODE_ENV') == 'PROD' ? false : true,
      }),
    }),
    AuthModule,
    LesserConfigModule,
    GithubApiModule,
    LesserJwtModule,
    MemberModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    MemberRepository,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
    consumer
      .apply(BearerTokenMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
