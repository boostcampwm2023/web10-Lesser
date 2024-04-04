import * as request from 'supertest';
import { app, createMember, memberFixture } from 'test/setup';

describe('GET /api/project', () => {
  const projectPayloads = [
    {
      title: 'Lesser1',
      subject: '애자일한 프로젝트 관리 툴',
    },
    {
      title: 'Lesser2',
      subject: '애자일한 프로젝트 관리 툴',
    },
  ];

  it('should return 200, project list', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    for (const payload of projectPayloads) {
      await request(app.getHttpServer())
        .post('/api/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);
    }

    const response = await request(app.getHttpServer())
      .get('/api/project')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.projects).toBeDefined();
    const projects = response.body.projects;
    expect(projects.length).toBe(2);
    expect(projects[0].title).toBe('Lesser1');
    expect(projects[1].title).toBe('Lesser2');
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
