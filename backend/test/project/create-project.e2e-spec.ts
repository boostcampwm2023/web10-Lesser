import * as request from 'supertest';
import { app, createMember, memberFixture } from 'test/setup';

describe('POST /api/project', () => {
  const createProjectPayload = {
    title: 'Lesser',
    subject: '애자일한 프로젝트 관리 툴',
  };

  it('should return 201', async () => {
    const { accessToken } = await createMember(memberFixture, app);

    const response = await request(app.getHttpServer())
      .post('/api/project')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createProjectPayload);

    expect(response.status).toBe(201);
  });

  it('should return 400', async () => {
    const { accessToken } = await createMember(memberFixture, app);

    const response = await request(app.getHttpServer())
      .post('/api/project')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        invalidProperty: 'invalidProperty',
      });

    expect(response.status).toBe(400);
  });

  it('should return 401 (Bearer Token is missing)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/project')
      .send(createProjectPayload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Bearer Token is missing');
  });

  it('should return 401 (Expired:accessToken) when given invalid access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/project')
      .set('Authorization', `Bearer invalidToken`)
      .send(createProjectPayload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:accessToken');
  });
});
