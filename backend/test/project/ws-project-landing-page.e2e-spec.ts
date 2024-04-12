import * as request from 'supertest';
import { app, appInit, createMember, memberFixture } from 'test/setup';
import { io } from 'socket.io-client';

describe('GET /api/project', () => {
  let socket;
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });
  afterEach(async () => {
    socket.close();
  });

  const projectPayload = {
    title: 'Lesser1',
    subject: '애자일한 프로젝트 관리 툴',
  };

  it('should return project data', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    await request(app.getHttpServer())
      .post('/api/project')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(projectPayload);
    const response = await request(app.getHttpServer())
      .get('/api/project')
      .set('Authorization', `Bearer ${accessToken}`);
    const [project] = response.body.projects;
    socket = io(`http://localhost:3000/project-${project.id}`);

    return new Promise<void>((resolve) => {
      socket.on('connect', () => {
        socket.emit('joinLanding');
      });
      socket.on('landing', (data) => {
        const { action, content } = data;
        expect(action).toBe('init');
        expect(content.project.title).toBe(projectPayload.title);
        expect(content.project.subject).toBe(projectPayload.subject);
        expect(content.project.createdAt).toBeDefined();
        expect(content.myInfo).toBeDefined();
        expect(content.member).toBeDefined();
        expect(content.sprint).toBeDefined();
        expect(content.board).toBeDefined();
        expect(content.link).toBeDefined();
        resolve();
      });
    });
  });
});
