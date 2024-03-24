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

  it('should return 401 (Authorization header is missing)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .send();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authorization header is missing');
  });

  it('should return 401 (Invalid authorization header format)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `accessToken`)
      .send();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid authorization header format');
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
