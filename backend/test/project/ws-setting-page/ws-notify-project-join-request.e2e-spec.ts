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

  it('should notify join request in setting page when project join request is submitted', async () => {
    const { accessToken: leaderAccessToken } = await createMember(
      memberFixture,
      app,
    );

    const { id: projectId } = await createProject(
      leaderAccessToken,
      projectPayload,
      app,
    );
    const leaderSocket = await enterSettingPage(projectId, leaderAccessToken);

    const { accessToken: requestingAccessToken } = await createMember(
      memberFixture2,
      app,
    );

    const requestingMember = await getMemberByAccessToken(
      requestingAccessToken,
    );

    const expectPromise = expectNotifyJoinRequest(
      leaderSocket,
      requestingMember,
    );
    const submitPromise = submitJoinRequest(
      leaderAccessToken,
      projectId,
      requestingAccessToken,
    );
    await Promise.all([expectPromise, submitPromise]);
    closePage(leaderSocket);
  });

  async function enterSettingPage(projectId: number, accessToken: string) {
    const socket = connectServer(projectId, accessToken);
    socket.emit('joinSetting');

    await new Promise<void>((resolve) => {
      socket.once('setting', (data) => {
        const { action, domain } = data;
        expect(domain).toBe('setting');
        expect(action).toBe('init');
        resolve();
      });
    });

    return socket;
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

async function expectNotifyJoinRequest(
  socket: Socket,
  requestingMember: Member,
) {
  return new Promise<void>((resolve) => {
    socket.on('setting', (data) => {
      const { action, domain, content } = data;
      expect(domain).toBe('joinRequest');
      expect(action).toBe('create');
      expect(content.joinRequest).toBeDefined();
      expect(content.joinRequest.id).toBeDefined();
      expect(content.joinRequest.memberId).toBe(requestingMember.id);
      expect(content.joinRequest.username).toBe(requestingMember.username);
      expect(content.joinRequest.imageUrl).toBe(
        requestingMember.github_image_url,
      );
      resolve();
    });
  });
}
