import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { BacklogsController } from './backlogs.controller';
import { BacklogsService } from './backlogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Epic, Story, Task])],
  controllers: [BacklogsController],
  providers: [BacklogsService],
})
export class BacklogsModule {}
