import * as request from 'supertest';
import { app, createMember, memberFixture } from 'test/setup';

describe('POST /api/auth/logout', () => {
  it('should return 200', async () => {
    const { accessToken } = await createMember(memberFixture, app);

    const response = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);

    const [cookie] = response.headers['set-cookie'];
    expect(cookie).toBeDefined();
    expect(cookie.includes('refreshToken=;')).toBeTruthy();
    expect(
      cookie.includes('Expires=Thu, 01 Jan 1970 00:00:00 GMT;'),
    ).toBeTruthy();
  });

  it('should return 401 (Not a logged in member)', async () => {
    const { accessToken } = await createMember(memberFixture, app);

    let response;
    for (let i = 0; i < 2; i++) {
      response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send();
    }

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not a logged in member');
  });

  it('should return 401 (Bearer Token is missing)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .send();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Bearer Token is missing');
  });

  it('should return 401 (Expired:accessToken)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer invalidToken`)
      .send();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:accessToken');
  });
});
