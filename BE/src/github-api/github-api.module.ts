import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubOauthService } from './oauth.service';
import { GithubResourceService } from './resource.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [GithubOauthService, GithubResourceService],
  exports: [GithubOauthService, GithubResourceService],
})
export class GithubApiModule {}
