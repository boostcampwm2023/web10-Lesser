import * as request from 'supertest';
import { app, createMember, jwtTokenPattern, memberFixture } from 'test/setup';

describe('POST /api/auth/refresh', () => {
  it('should return 201', async () => {
    const { refreshToken: oldRefreshToken } = await createMember(
      memberFixture,
      app,
    );

    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Cookie', `refreshToken=${oldRefreshToken}`)
      .send();

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toMatch(jwtTokenPattern);
    const [cookie] = response.headers['set-cookie'];
    expect(cookie).toBeDefined();
    const [, refreshToken] = cookie.match(/refreshToken=([^;]+)/);
    expect(refreshToken).toMatch(jwtTokenPattern);
  });

  it('should return 401 (Refresh Token is missing)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Refresh Token is missing');
  });

  it('should return 401 (Expired:refreshToken) when already logout member', async () => {
    const { accessToken, refreshToken } = await createMember(
      memberFixture,
      app,
    );
    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:refreshToken');
  });

  it('should return 401 (Expired:refreshToken) when invalid refresh token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Cookie', `refreshToken=invalidAccessToken`)
      .send();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:refreshToken');
  });
});
