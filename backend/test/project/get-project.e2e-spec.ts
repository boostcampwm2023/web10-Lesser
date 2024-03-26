import * as request from 'supertest';
import { app, createMember, memberFixture } from 'test/setup';
import { projectFixtures } from 'fixtures/project-fixtures';

describe('GET /api/project', () => {
  it('should return 200', async () => {
    const { accessToken } = await createMember(memberFixture, app);

    const response = await request(app.getHttpServer())
      .get('/api/project')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.projects).toEqual(projectFixtures);
  });

  it('should return 401 (Bearer Token is missing)', async () => {
    const response = await request(app.getHttpServer()).get('/api/project');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Bearer Token is missing');
  });

  it('should return 401 Expired:accessToken', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/project')
      .set('Authorization', `Bearer accessToken`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:accessToken');
  });
});
