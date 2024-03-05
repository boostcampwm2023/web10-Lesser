import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { GithubApiModule } from 'src/github-api/github-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempMember } from './entity/tempMember.entity';
import { LesserJwtModule } from 'src/lesser-jwt/lesser-jwt.module';
import { TempMemberRepository } from './repository/tempMember.repository';
import { MemberModule } from 'src/member/member.module';
import { LoginMember } from './entity/loginMember.entity';
import { LoginMemberRepository } from './repository/loginMember.repository';

@Module({
  imports: [
    GithubApiModule,
    TypeOrmModule.forFeature([TempMember, LoginMember]),
    LesserJwtModule,
    MemberModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TempMemberRepository, LoginMemberRepository],
})
export class AuthModule {}
