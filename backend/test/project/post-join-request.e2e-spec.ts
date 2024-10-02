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

describe('Join Request In Project', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });

  it('should return 201 when join request is successfully submitted', async () => {
    const { accessToken: accessToken1 } = await createMember(
      memberFixture,
      app,
    );
    const { accessToken: accessToken2 } = await createMember(
      memberFixture2,
      app,
    );
    const { id: projectId } = await createProject(
      accessToken1,
      projectPayload,
      app,
    );
    const inviteLinkId = await getProjectLinkId(accessToken1, projectId);
    const response = await postJoinRequest(accessToken2, inviteLinkId);
    expectCreated(response);
  });

  it('should return 400 when given bad request', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const response = await postJoinRequestWithInvalidProperty(accessToken);
    expectBadRequest(response);
  });

  it('should return 401 (Bearer Token is missing)', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const inviteLinkId = await getProjectLinkId(accessToken, projectId);
    const response = await postJoinRequestWithoutAccessToken(inviteLinkId);
    expectMissingBearerToken(response);
  });

  it('should return 401 (Expired:accessToken) when given invalid access token', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const inviteLinkId = await getProjectLinkId(accessToken, projectId);
    const response = await postJoinRequest('invalidToken', inviteLinkId);
    expectExpiredToken(response);
  });

  it('should return 404 when project link ID is not found', async () => {
    const invalidUUID = 'c93a87e8-a0a4-4b55-bdf2-59bf691f5c37';
    const { accessToken } = await createMember(memberFixture2, app);
    const response = await postJoinRequest(accessToken, invalidUUID);
    expectNotFound(response);
  });

  it('should return 409 when already joined member', async () => {
    const { accessToken } = await createMember(memberFixture, app);
    const { id: projectId } = await createProject(
      accessToken,
      projectPayload,
      app,
    );
    const inviteLinkId = await getProjectLinkId(accessToken, projectId);
    const response = await postJoinRequest(accessToken, inviteLinkId);
    expectAlreadyMember(response);
  });

  it('should return 409 when already submit join request', async () => {
    const { accessToken: accessToken1 } = await createMember(
      memberFixture,
      app,
    );
    const { accessToken: accessToken2 } = await createMember(
      memberFixture2,
      app,
    );

    const { id: projectId } = await createProject(
      accessToken1,
      projectPayload,
      app,
    );
    const inviteLinkId = await getProjectLinkId(accessToken1, projectId);
    await postJoinRequest(accessToken2, inviteLinkId);
    const response = await postJoinRequest(accessToken2, inviteLinkId);
    expectAlreadySubmit(response);
  });
});

function postJoinRequest(
  accessToken: string,
  inviteLinkId: string,
): Promise<request.Response> {
  return request(app.getHttpServer())
    .post('/api/project/join-request')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ inviteLinkId });
}

function postJoinRequestWithInvalidProperty(
  accessToken: string,
): Promise<request.Response> {
  return request(app.getHttpServer())
    .post('/api/project/join-request')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ invalidProperty: 'invalidProperty' });
}

function postJoinRequestWithoutAccessToken(
  inviteLinkId: string,
): Promise<request.Response> {
  return request(app.getHttpServer())
    .post('/api/project/join-request')
    .send({ inviteLinkId });
}

function expectNotFound(response: request.Response) {
  expect(response.status).toBe(404);
}

function expectCreated(response: request.Response) {
  expect(response.status).toBe(201);
}

function expectBadRequest(response: request.Response) {
  expect(response.status).toBe(400);
}

function expectMissingBearerToken(response: request.Response) {
  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Bearer Token is missing');
}

function expectAlreadyMember(response: request.Response) {
  expect(response.status).toBe(409);
  expect(response.body.message).toBe('Already a project member');
}

function expectAlreadySubmit(response: request.Response) {
  expect(response.status).toBe(409);
  expect(response.body.message).toBe('Join request already submitted');
}

function expectExpiredToken(response: request.Response) {
  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Expired:accessToken');
}
