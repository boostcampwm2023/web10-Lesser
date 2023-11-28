import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { MembersController } from './members.controller';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), LesserJwtModule, ConfigModule.forRoot()],
  controllers: [MembersController],
  providers: [MembersService, ConfigService],
})
export class MembersModule {}
