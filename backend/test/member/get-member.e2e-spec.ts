import * as request from 'supertest';
import { app, createMember, memberFixture } from 'test/setup';

describe('GET /api/member', () => {
  it('should return 200', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const response = await request(app.getHttpServer())
      .get('/api/member')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(memberFixture.username);
    expect(response.body.imageUrl).toBe(memberFixture.github_image_url);
  });

  it('should return 401 (Authorization header is missing)', async () => {
    const response = await request(app.getHttpServer()).get('/api/member');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authorization header is missing');
  });

  it('should return 401 (Invalid authorization header format)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/member')
      .set('Authorization', `accessToken`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid authorization header format');
  });

  it('should return 401 Expired:accessToken', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/member')
      .set('Authorization', `Bearer accessToken`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:accessToken');
  });
});
