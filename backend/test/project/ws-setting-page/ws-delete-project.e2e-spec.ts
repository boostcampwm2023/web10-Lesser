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
import { handleConnectErrorWithReject } from '../ws-common';
import { Socket } from 'socket.io-client';

describe('WS project', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });
  describe('delete project', () => {
    it('should return deleted project event when leader request', async () => {
      let socket1: Socket;
      let socket2: Socket;

      await new Promise<void>(async (resolve, reject) => {
        const accessToken1 = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken1, projectPayload, app);
        const projectLinkId = await getProjectLinkId(accessToken1, project.id);

        const accessToken2 = (await createMember(memberFixture2, app))
          .accessToken;
        await joinProject(accessToken2, projectLinkId);

        socket1 = connectServer(project.id, accessToken1);
        handleConnectErrorWithReject(socket1, reject);
        await joinSettingPage(socket1);

        socket2 = connectServer(project.id, accessToken2);
        handleConnectErrorWithReject(socket2, reject);
        await joinLandingPage(socket2);

        socket1.emit('projectInfo', {
          action: 'delete',
          content: {},
        });

        await Promise.all([
          expectDeleteProject(socket1, 'main'),
          expectDeleteProject(socket2, 'main'),
        ]);

        await Promise.all([
          expectCloseSocket(socket1),
          expectCloseSocket(socket2),
        ]);
        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });

    const expectDeleteProject = (socket: Socket, eventPage: string) => {
      return new Promise<void>((resolve) => {
        socket.on(eventPage, (data) => {
          const { action, domain } = data;
          if (domain === 'projectInfo' && action === 'delete') {
            resolve();
          }
        });
      });
    };
    const expectCloseSocket = (socket: Socket) => {
      return new Promise<void>((resolve) => {
        socket.on('disconnect', () => {
          resolve();
        });
      });
    };
  });
});

const joinSettingPage = (socket: Socket) => {
  return new Promise<void>((resolve) => {
    socket.emit('joinSetting');
    socket.once('setting', (data) => {
      const { action, domain } = data;
      if (domain === 'setting' && action === 'init') {
        resolve();
      }
    });
  });
};

const joinLandingPage = (socket: Socket) => {
  return new Promise<void>((resolve) => {
    socket.emit('joinLanding');
    socket.once('landing', (data) => {
      const { action, domain } = data;
      if (domain === 'landing' && action === 'init') {
        resolve();
      }
    });
  });
};
