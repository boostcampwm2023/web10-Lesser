import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './domain/service/members.service';
import { Member } from './domain/entity/member.entity';
import { MembersController } from './controller/members.controller';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GithubOauthService } from 'src/github-api/oauth.service';
import { GithubResourceService } from 'src/github-api/resource.service';
import { MemberRepository } from './repository/member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), LesserJwtModule, ConfigModule.forRoot()],
  controllers: [MembersController],
  providers: [
    MembersService,
    GithubOauthService,
    GithubResourceService,
    ConfigService,
    {
      provide: 'MemberRepo',
      useClass: MemberRepository,
    },
  ],
  exports: ['MemberRepo'],
})
export class MembersModule {}
