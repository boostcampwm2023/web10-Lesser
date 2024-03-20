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
    const { member } = await createMember(memberFixture);
    
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'authCode' });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toMatch(jwtTokenPattern);
    expect(response.body.member).toEqual({
      username: member.username,
      imageUrl: member.github_image_url,
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

  it('should return 401', async () => {
    jest.spyOn(githubApiService, 'fetchAccessToken').mockResolvedValue({});
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'invalidAuthCode' });

    expect(response.status).toBe(401);
  });
});
