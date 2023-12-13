import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubUser, GithubEmail } from './dto/github.dto';

@Injectable()
export class GithubResourceService {
  constructor(private readonly configService: ConfigService) {}

  async fetchGithubUser(accessToken: string): Promise<GithubUser> {
    try {
      const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const githubUser: GithubUser = {
        github_id: data.id,
        username: data.login,
        email: data.email,
        image_url: data.avatar_url,
      };
      return githubUser;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async fetchGithubEmail(accessToken: string): Promise<string> {
    try {
      const response = await fetch('https://api.github.com/user/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const emailList: GithubEmail[] = await response.json();
      const primaryEmail = emailList.find((email) => email.primary === true);
      return primaryEmail.email;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
