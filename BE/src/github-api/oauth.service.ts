import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubOauthService {
  constructor(private readonly configService: ConfigService) {}

  async getGithubAccessToken(code: string) {
    const body = {
      client_id: this.configService.get('GITHUB_CLIENT_ID'),
      client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
      code: code,
    };
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });
      const oauthData = await response.json();
      const accessToken = oauthData.access_token;
      return accessToken;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
