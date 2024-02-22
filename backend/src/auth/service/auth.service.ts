import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubApiService } from 'src/github-api/github-api.service';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRETS,
} from 'src/lesser-config/constants';
import { GithubUserDto } from './dto/github-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly githubApiService: GithubApiService,
  ) {}
  private readonly ENV_GITHUB_CLIENT_ID =
    this.configService.get(GITHUB_CLIENT_ID);

  getGithubAuthUrl(): string {
    return `https://github.com/login/oauth/authorize?client_id=${this.ENV_GITHUB_CLIENT_ID}&scope=`;
  }

  async getAccessToken(authCode: string) {
    try {
      const body = {
        client_id: this.configService.get(GITHUB_CLIENT_ID),
        client_secret: this.configService.get(GITHUB_CLIENT_SECRETS),
        code: authCode,
      };
      const { access_token } =
        await this.githubApiService.fetchAccessToken(body);
      if (!access_token) throw new Error('Invalid authorization code');
      return access_token;
    } catch (err) {
      throw new Error('Cannot retrieve access token');
    }
  }

  async getGithubUser(accessToken: string) {
    try {
      const { id, login, avatar_url } =
        await this.githubApiService.fetchGithubUser(accessToken);
      const githubUser = GithubUserDto.of(id, login, avatar_url);
      return githubUser;
    } catch (err) {
      throw new Error('Cannot retrieve github user');
    }
  }
}
