import { Module } from '@nestjs/common';
import { LesserJwtModule } from '../lesser-jwt/lesser-jwt.module';
import { IsLoginGuard } from './IsLogin.guard';
import { ProjectAccessGuard } from './ProjectAccessGuard.guard';

@Module({
  imports: [LesserJwtModule],
  providers: [IsLoginGuard, ProjectAccessGuard],
})
export class AuthModule {}
