import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';

@Module({
  providers: [SprintsService]
})
export class SprintsModule {}
