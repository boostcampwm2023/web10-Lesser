import { Module } from '@nestjs/common';
import { MemberService } from './service/member.service';
import { Member } from './entity/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberRepository } from './repository/member.repository';
import { MemberController } from './controller/member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberService, MemberRepository],
  exports: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
