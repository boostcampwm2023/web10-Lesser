import { Module } from '@nestjs/common';
import { LesserJwtModule } from 'src/lesser-jwt/lesser-jwt.module';
import { ProjectController } from './project.controller';

@Module({
  imports: [LesserJwtModule],
  controllers: [ProjectController],
})
export class ProjectModule {}
