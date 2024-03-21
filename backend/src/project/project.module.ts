import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { LesserJwtModule } from 'src/lesser-jwt/lesser-jwt.module';

@Module({
  imports: [LesserJwtModule],
  controllers: [ProjectController],
})
export class ProjectModule {}
