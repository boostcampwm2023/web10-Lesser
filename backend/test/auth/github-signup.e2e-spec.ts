import * as request from 'supertest';
import {
  app,
  githubApiService,
  jwtTokenPattern,
  memberFixture,
} from 'test/setup';

describe('POST /api/auth/github/signup', () => {
  const memberSignupPayload = {
    username: memberFixture.username,
    position: memberFixture.position,
    techStack: memberFixture.tech_stack.stacks,
  };
  it('should return 201', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/api/auth/github/signup')
      .set('Authorization', `Bearer ${authenticationResponse.body.tempIdToken}`)
      .send(memberSignupPayload);

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

  it('should return 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/signup')
      .send({
        invalidProperty: 'invalidProperty',
      });

    expect(response.status).toBe(400);
  });

  it('should return 401 (Bearer Token is missing)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/signup')
      .send(memberSignupPayload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Bearer Token is missing');
  });

  it('should return 401 (Expired:tempIdToken) when given invalid temp id token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/signup')
      .set('Authorization', `Bearer invalidToken`)
      .send(memberSignupPayload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:tempIdToken');
  });

  it('should return 401 (Expired:tempIdToken) when given not matching temp id token', async () => {
    const {
      body: { tempIdToken },
    } = await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'authCode' });

    await request(app.getHttpServer())
      .post('/api/auth/github/authentication')
      .send({ authCode: 'authCode' });

    const response = await request(app.getHttpServer())
      .post('/api/auth/github/signup')
      .set('Authorization', `Bearer ${tempIdToken}`)
      .send(memberSignupPayload);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:tempIdToken');
  });
});
