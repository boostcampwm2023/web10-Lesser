import * as request from 'supertest';
import { app, githubApiService, createMember, memberFixture } from 'test/setup';

describe('GET /api/member', () => {
  it('should return 200', async () => {
    const { accessToken, member } = await createMember(memberFixture);
    const response = await request(app.getHttpServer())
      .get('/api/member')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(member.username);
    expect(response.body.imageUrl).toBe(member.github_image_url);
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
