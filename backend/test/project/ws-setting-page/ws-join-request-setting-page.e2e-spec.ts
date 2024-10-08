import { Socket } from 'socket.io-client';
import * as request from 'supertest';
import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  getMemberByAccessToken,
  getProjectLinkId,
  listenAppAndSetPortEnv,
  memberFixture,
  memberFixture2,
  projectPayload,
} from 'test/setup';
import { Member } from 'src/member/entity/member.entity';

describe('WS Setting', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });

  it('should return join request data when leader enters setting page', async () => {
    const { accessToken: leaderAccessToken } = await createMember(
      memberFixture,
      app,
    );

    const { id: projectId } = await createProject(
      leaderAccessToken,
      projectPayload,
      app,
    );

    const { accessToken: requestingAccessToken } = await createMember(
      memberFixture2,
      app,
    );

    await submitJoinRequest(
      leaderAccessToken,
      projectId,
      requestingAccessToken,
    );
    const requestingMember = await getMemberByAccessToken(
      requestingAccessToken,
    );

    const leaderSocket = await enterSettingPage(projectId, leaderAccessToken);
    await expectJoinRequestList(leaderSocket, requestingMember);
    closePage(leaderSocket);
  });

  async function enterSettingPage(projectId: number, accessToken: string) {
    const socket = connectServer(projectId, accessToken);
    socket.emit('joinSetting');
    return socket;
  }

  async function expectJoinRequestList(
    socket: Socket,
    requestingMember: Member,
  ) {
    return new Promise<void>((resolve) => {
      socket.on('setting', (data) => {
        const { action, domain, content } = data;
        expect(domain).toBe('setting');
        expect(action).toBe('init');
        expect(content.joinRequestList).toBeDefined();
        expect(content.joinRequestList.length).toBe(1);
        expect(content.joinRequestList[0].id).toBeDefined();
        expect(content.joinRequestList[0].memberId).toBe(requestingMember.id);
        expect(content.joinRequestList[0].username).toBe(
          requestingMember.username,
        );
        expect(content.joinRequestList[0].imageUrl).toBe(
          requestingMember.github_image_url,
        );
        resolve();
      });
    });
  }

  function closePage(socket: Socket) {
    socket.close();
  }
});

async function submitJoinRequest(
  leaderAccessToken: string,
  projectId: number,
  requestingAccessToken: string,
): Promise<request.Response> {
  const inviteLinkId = await getProjectLinkId(leaderAccessToken, projectId);
  return request(app.getHttpServer())
    .post('/api/project/join-request')
    .set('Authorization', `Bearer ${requestingAccessToken}`)
    .send({ inviteLinkId });
}
