import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { MembersController } from './members.controller';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemberRepository } from './Repository/member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), LesserJwtModule, ConfigModule.forRoot()],
  controllers: [MembersController],
  providers: [
    MembersService,
    ConfigService,
    {
      provide: 'MemberRepo',
      useClass: MemberRepository,
    },
  ],
  exports: ['MemberRepo'],
})
export class MembersModule {}
