import * as request from 'supertest';
import {
  app,
  appInit,
  createMember,
  createProject,
  getProjectLinkId,
  memberFixture,
  memberFixture2,
  projectPayload,
} from 'test/setup';

describe('Join Project', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  it('should return 201', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const projectLinkId = await getProjectLinkId(accessToken, projectId);
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
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const projectLinkId = await getProjectLinkId(accessToken, projectId);
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
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const projectLinkId = await getProjectLinkId(accessToken, projectId);

    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .send({ inviteLinkId: projectLinkId });

    expect(response.status).toBe(401);
  });

  it('should return 401 (Expired:accessToken) when given invalid access token', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const projectLinkId = await getProjectLinkId(accessToken, projectId);

    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .set('Authorization', `Bearer invalidToken`)
      .send({ inviteLinkId: projectLinkId });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:accessToken');
  });

  it('should return 404 when project link ID is not found', async () => {
    const invalidUUID = 'c93a87e8-a0a4-4b55-bdf2-59bf691f5c37';
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
