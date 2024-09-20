import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  getProjectLinkId,
  joinProject,
  listenAppAndSetPortEnv,
  memberFixture,
  memberFixture2,
  projectPayload,
} from 'test/setup';
import {
  emitJoinLanding,
  handleConnectErrorWithReject,
  handleErrorWithReject,
  initLanding,
} from '../ws-common';

describe('WS invite link', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });
  describe('update invite link', () => {
    it('should return updated invite link data when project leader request', async () => {
      let socket;
      return new Promise<void>(async (resolve, reject) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);
        socket = connectServer(project.id, accessToken);
        handleConnectErrorWithReject(socket, reject);
        handleErrorWithReject(socket, reject);
        await emitJoinLanding(socket);
        await initLanding(socket);
        const data = {
          action: 'update',
          content: {},
        };
        socket.emit('inviteLink', data);
        await expectUpdateInviteLink(socket);
        resolve();
      }).finally(() => {
        socket.close();
      });
    });
    const expectUpdateInviteLink = async (socket) => {
      return await new Promise<void>((res) => {
        socket.once('landing', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('inviteLink');
          expect(action).toBe('update');
          expect(content.inviteLinkId).toBeDefined();
          expect(typeof content.inviteLinkId).toBe('string');
          res();
        });
      });
    };

    it('should disconnect if the requester is not the project leader', async () => {
      let socket;
      return new Promise<void>(async (resolve, reject) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);
        const projectLinkId = await getProjectLinkId(accessToken, project.id);

        const accessToken2 = (await createMember(memberFixture2, app))
          .accessToken;
        await joinProject(accessToken2, projectLinkId);

        socket = connectServer(project.id, accessToken2);
        handleConnectErrorWithReject(socket, reject);
        handleErrorWithReject(socket, reject);
        await emitJoinLanding(socket);
        await initLanding(socket);
        const data = {
          action: 'update',
          content: {},
        };
        socket.emit('inviteLink', data);
        socket.on('disconnect', () => {
          resolve();
        });
      }).finally(() => {
        socket.close();
      });
    });
  });
});
