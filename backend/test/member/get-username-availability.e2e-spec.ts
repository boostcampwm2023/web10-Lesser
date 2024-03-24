import * as request from 'supertest';
import { app, createMember, memberFixture } from 'test/setup';

describe('GET /api/member/availability', () => {
  it('should return 200 { available: true } when input username is available', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/member/availability')
      .query({ username: 'availableUsername' });

    expect(response.status).toBe(200);
    expect(response.body.available).toBe(true);
  });

  it('should return 200 { available: false } when input username is not available', async () => {
    await createMember(memberFixture, app);

    const response = await request(app.getHttpServer())
      .get('/api/member/availability')
      .query({ username: memberFixture.username });

    expect(response.status).toBe(200);
    expect(response.body.available).toBe(false);
  });

  it('should throw 400 when given bad request', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/member/availability')
      .query({});

    expect(response.status).toBe(400);
  });
});
