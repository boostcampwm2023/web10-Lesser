import * as request from 'supertest';
import { app } from 'test/setup';

describe('AuthController (e2e)', () => {
  it('GET /api/auth/github/authorization-server', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/auth/github/authorization-server',
    );
    const urlPattern = new RegExp(
      `^https://github.com/login/oauth/authorize\\?client_id=[\\w]+&scope=[\\w]*$`,
    );
    expect(response.status).toBe(200);
    expect(response.body.authUrl).toMatch(urlPattern);
  });
});
