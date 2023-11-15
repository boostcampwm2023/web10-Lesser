import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from 'src/entities/epic.entity';
import { BacklogsController } from './backlogs.controller';
import { BacklogsService } from './backlogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Epic])],
  controllers: [BacklogsController],
  providers: [BacklogsService],
})
export class BacklogsModule {}
