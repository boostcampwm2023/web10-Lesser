import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BacklogsController } from './backlogs/backlogs.controller';
import { SprintsController } from './sprints/sprints.controller';
import { MembersController } from './members/members.controller';
import { ProjectsController } from './projects/projects.controller';
import { ReviewsController } from './reviews/reviews.controller';
import { BacklogsModule } from './backlogs/backlogs.module';
import { MembersModule } from './members/members.module';
import { ProjectsModule } from './projects/projects.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SprintsModule } from './sprints/sprints.module';

@Module({
  imports: [
    BacklogsModule,
    MembersModule,
    ProjectsModule,
    ReviewsModule,
    SprintsModule,
  ],
  controllers: [
    AppController,
    BacklogsController,
    SprintsController,
    MembersController,
    ProjectsController,
    ReviewsController,
  ],
  providers: [AppService],
})
export class AppModule {}
