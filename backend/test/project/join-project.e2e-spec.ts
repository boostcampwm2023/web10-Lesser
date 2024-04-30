import * as request from 'supertest';
import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  githubApiService,
  memberFixture,
  memberFixture2,
  projectPayload,
} from 'test/setup';

describe('Join Project', () => {
  let socket;
  let projectLinkId;
  let projectId;
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);

    const { accessToken } = await createMember(memberFixture, app);
    const project = await createProject(accessToken, projectPayload, app);
    projectId = project.id;
    socket = connectServer(projectId, accessToken);
    await new Promise<void>((resolve) => {
      socket.on('connect', () => {
        socket.emit('joinLanding');
      });
      socket.on('landing', (data) => {
        const { content } = data;
        projectLinkId = content.inviteLinkId;
        resolve();
      });
    });
  });
  afterEach(async () => {
    socket.close();
  });

  it('should return 201', async () => {
    jest.spyOn(githubApiService, 'fetchGithubUser').mockResolvedValue({
      id: '321',
      login: 'username',
      avatar_url: 'avatar_url',
    });
    const { accessToken: newAccessToken } = await createMember(
      memberFixture2,
      app,
    );
    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .set('Authorization', `Bearer ${newAccessToken}`)
      .send({ inviteLinkId: projectLinkId });
    expect(response.status).toBe(201);
  });

  it('should return 200 when already joined member', async () => {
    jest.spyOn(githubApiService, 'fetchGithubUser').mockResolvedValue({
      id: '321',
      login: 'username',
      avatar_url: 'avatar_url',
    });
    const { accessToken: newAccessToken } = await createMember(
      memberFixture2,
      app,
    );
    await request(app.getHttpServer())
      .post('/api/project/join')
      .set('Authorization', `Bearer ${newAccessToken}`)
      .send({ inviteLinkId: projectLinkId });

    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .set('Authorization', `Bearer ${newAccessToken}`)
      .send({ inviteLinkId: projectLinkId });
    expect(response.status).toBe(200);
    expect(response.body.projectId).toBe(projectId);
  });

  it('should return 400 when given bad request', async () => {
    jest.spyOn(githubApiService, 'fetchGithubUser').mockResolvedValue({
      id: '321',
      login: 'username',
      avatar_url: 'avatar_url',
    });
    const { accessToken: newAccessToken } = await createMember(
      memberFixture2,
      app,
    );
    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .set('Authorization', `Bearer ${newAccessToken}`)
      .send({ invalidProperty: 'invalidProperty' });

    expect(response.status).toBe(400);
  });

  it('should return 401 (Bearer Token is missing)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .send({ inviteLinkId: projectLinkId });

    expect(response.status).toBe(401);
  });

  it('should return 401 (Expired:accessToken) when given invalid access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .set('Authorization', `Bearer invalidToken`)
      .send({ inviteLinkId: projectLinkId });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:accessToken');
  });

  it('should return 404 when project link ID is not found', async () => {
    const invalidUUID = 'c93a87e8-a0a4-4b55-bdf2-59bf691f5c37';
    jest.spyOn(githubApiService, 'fetchGithubUser').mockResolvedValue({
      id: memberFixture2.github_id,
      login: memberFixture2.github_username,
      avatar_url: memberFixture2.github_image_url,
    });
    const { accessToken: newAccessToken } = await createMember(
      memberFixture2,
      app,
    );

    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .set('Authorization', `Bearer ${newAccessToken}`)
      .send({ inviteLinkId: invalidUUID });

    expect(response.status).toBe(404);
  });
});
