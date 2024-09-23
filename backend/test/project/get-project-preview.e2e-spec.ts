import * as request from 'supertest';
import {
  app,
  appInit,
  createMember,
  createProject,
  getProjectLinkId,
  listenAppAndSetPortEnv,
  memberFixture,
  memberFixture2,
  projectPayload,
} from 'test/setup';

describe('GET /project/invite-preview', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });

  it('should return 200 when given valid invite link id', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const inviteLinkId = await getProjectLinkId(accessToken, projectId);
    const { accessToken: newAccessToken } = await createMember(
      memberFixture2,
      app,
    );

    const response = await request(app.getHttpServer())
      .get(`/api/project/invite-preview/${inviteLinkId}`)
      .set('Authorization', `Bearer ${newAccessToken}`);

    expect(response.status).toBe(200);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.title).toBe(projectPayload.title);
    expect(response.body.subject).toBe(projectPayload.subject);
    expect(response.body.leaderUsername).toBe(memberFixture.username);
  });

  it('should return 404 when project link ID is not found', async () => {
    const invalidUUID = 'c93a87e8-a0a4-4b55-bdf2-59bf691f5c37';
    const { accessToken: newAccessToken } = await createMember(
      memberFixture2,
      app,
    );

    const response = await request(app.getHttpServer())
      .get(`/api/project/invite-preview/${invalidUUID}`)
      .set('Authorization', `Bearer ${newAccessToken}`);

    expect(response.status).toBe(404);
  });

  it('should return 401 (Bearer Token is missing)', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const projectLinkId = await getProjectLinkId(accessToken, projectId);

    const response = await request(app.getHttpServer()).get(
      `/api/project/invite-preview/${projectLinkId}`,
    );

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
      .get(`/api/project/invite-preview/${projectLinkId}`)
      .set('Authorization', `Bearer invalidToken`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Expired:accessToken');
  });
});
