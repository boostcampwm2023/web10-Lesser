import * as request from 'supertest';
import { app, githubApiService } from 'test/setup';

describe('GET /api/auth/github/username', () => {
  it('should return 200 when given valid tempIdToken', async () => {
    const githubUserFixture = {
      id: '123',
      login: 'username',
      avatar_url: 'avatar_url',
    };
    jest
      .spyOn(githubApiService, 'fetchGithubUser')
      .mockResolvedValue(githubUserFixture);
    const authenticationResponse = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'authCode' });
    const tempIdToken = authenticationResponse.body.tempIdToken;

    const response = await request(app.getHttpServer())
      .get('/api/auth/github/username')
      .set('Authorization', `Bearer ${tempIdToken}`);

    expect(response.status).toBe(200);
    expect(response.body.githubUsername).toBe(githubUserFixture.login);
  });

  it('should return 401 (Bearer Token is missing)', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/auth/github/username',
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Bearer Token is missing');
  });

  it('should return 401 (Expired:tempIdToken)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/github/username')
      .set('Authorization', 'Bearer tempIdToken');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:tempIdToken');
  });
});
