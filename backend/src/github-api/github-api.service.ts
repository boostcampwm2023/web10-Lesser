import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubApiService {
  async fetchAccessToken(body: {
    client_id: string;
    client_secret: string;
    code: string;
  }) {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    return await response.json();
  }
}
