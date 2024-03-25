import * as request from 'supertest';
import { app, jwtTokenPattern, memberFixture } from 'test/setup';

describe('POST /api/auth/github/signup', () => {
  const memberSignupPayload = {
    username: memberFixture.username,
    position: memberFixture.position,
    techStack: memberFixture.tech_stack.stacks,
  };
  it('should return 201', async () => {
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

  it('should return 401 (Authorization header is missing)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/signup')
      .send(memberSignupPayload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authorization header is missing');
  });

  it('should return 401 (Invalid authorization header format)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/signup')
      .set('Authorization', `No Bearer tempIdToken`)
      .send(memberSignupPayload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid authorization header format');
  });

  it('should return 401 (Expired:tempIdToken)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/github/signup')
      .set('Authorization', `Bearer invalidToken`)
      .send(memberSignupPayload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:tempIdToken');
  });
});
