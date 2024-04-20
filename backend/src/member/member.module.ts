import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LesserJwtModule } from 'src/lesser-jwt/lesser-jwt.module';
import { MemberController } from './controller/member.controller';
import { MemberService } from './service/member.service';
import { MemberRepository } from './repository/member.repository';
import { Member } from './entity/member.entity';

@Module({
  imports: [LesserJwtModule, TypeOrmModule.forFeature([Member])],
  providers: [MemberService, MemberRepository],
  exports: [MemberService, TypeOrmModule],
  controllers: [MemberController],
})
export class MemberModule {}
