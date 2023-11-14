import { Module } from '@nestjs/common';
import { BacklogsService } from './backlogs.service';

@Module({
  providers: [BacklogsService],
})
export class BacklogsModule {}
