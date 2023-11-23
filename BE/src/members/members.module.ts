import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { MembersController } from './members.controller';
import { LesserJwtModule } from 'src/common/lesser-jwt/lesser-jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), LesserJwtModule],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
