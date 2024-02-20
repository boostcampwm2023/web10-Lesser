import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { GithubApiModule } from 'src/github-api/github-api.module';

@Module({
  imports: [GithubApiModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
