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

  it('should return 409 when Project reached its maximum member capacity', async () => {
    const MAX_CAPACITY = 10;
    const memberList = [];

    for (let i = 0; i < MAX_CAPACITY; i++) {
      const member = {
        ...memberFixture,
        github_id: i,
        username: `username${i}`,
      };
      const { accessToken } = await createMember(member, app);
      memberList.push({ member, accessToken });
    }

    const { id: projectId } = await createProject(
      memberList[0].accessToken,
      projectPayload,
      app,
    );
    const projectLinkId = await getProjectLinkId(
      memberList[0].accessToken,
      projectId,
    );
    for (let i = 1; i < MAX_CAPACITY; i++) {
      await request(app.getHttpServer())
        .post('/api/project/join')
        .set('Authorization', `Bearer ${memberList[i].accessToken}`)
        .send({ inviteLinkId: projectLinkId });
    }

    const exceedMemberFixture = {
      ...memberFixture,
      github_id: MAX_CAPACITY + 1,
      username: `username${MAX_CAPACITY + 1}`,
    };
    const { accessToken: exceedMemberAccessToken } = await createMember(
      exceedMemberFixture,
      app,
    );

    const response = await request(app.getHttpServer())
      .post('/api/project/join')
      .set('Authorization', `Bearer ${exceedMemberAccessToken}`)
      .send({ inviteLinkId: projectLinkId });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Project reached its maximum member capacity');
  });
});
