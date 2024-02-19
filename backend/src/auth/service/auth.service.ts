import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GITHUB_CLIENT_ID } from 'src/lesser-config/constants';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  private readonly ENV_GITHUB_CLIENT_ID = this.configService.get(GITHUB_CLIENT_ID);

  getGithubAuthUrl(): string {
    return `https://github.com/login/oauth/authorize?client_id=${this.ENV_GITHUB_CLIENT_ID}&scope=`;
  }
}
