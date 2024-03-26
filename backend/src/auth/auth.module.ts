import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LesserJwtModule } from 'src/lesser-jwt/lesser-jwt.module';
import { GithubApiModule } from 'src/github-api/github-api.module';
import { MemberModule } from 'src/member/member.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TempMemberRepository } from './repository/tempMember.repository';
import { LoginMemberRepository } from './repository/loginMember.repository';
import { TempMember } from './entity/tempMember.entity';
import { LoginMember } from './entity/loginMember.entity';

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
