import * as request from 'supertest';
import {
  app,
  githubApiService,
  jwtTokenPattern,
  createMember,
  memberFixture,
} from 'test/setup';

describe('POST /api/auth/github/authentication', () => {
  it('should return 201', async () => {
    await createMember(memberFixture, app);

    const response = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'authCode' });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toMatch(jwtTokenPattern);
    expect(response.body.member).toEqual({
      username: memberFixture.username,
      imageUrl: memberFixture.github_image_url,
    });
    const [cookie] = response.headers['set-cookie'];
    expect(cookie).toBeDefined();
    const [, refreshToken] = cookie.match(/refreshToken=([^;]+)/);
    expect(refreshToken).toMatch(jwtTokenPattern);
  });

  it('should return 209', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'authCode' });

    expect(response.status).toBe(209);
    expect(response.body.tempIdToken).toMatch(jwtTokenPattern);
  });

  it('should return 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ invalidParameter: 'authCode' });

    expect(response.status).toBe(400);
  });

  it('should return 401 when given fetch github access token error', async () => {
    jest
      .spyOn(githubApiService, 'fetchAccessToken')
      .mockRejectedValue(undefined);
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'invalidAuthCode' });

    expect(response.status).toBe(401);
  });

  it('should return 401 when given fetch github user error', async () => {
    jest
      .spyOn(githubApiService, 'fetchAccessToken')
      .mockResolvedValue({ access_token: 'accessToken' });
    jest
      .spyOn(githubApiService, 'fetchGithubUser')
      .mockRejectedValue(undefined);

    const response = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'authCode' });

    expect(response.status).toBe(401);
  });
});
