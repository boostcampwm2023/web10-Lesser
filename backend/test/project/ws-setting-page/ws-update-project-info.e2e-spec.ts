import { Socket } from 'socket.io-client';
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

describe('WS projectInfo', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });

  describe('update projectInfo', () => {
    it('Should return project setting data when leader enters setting page', async () => {
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

        const newTitle = '새로운 제목';
        const newSubject = '새로운 주제';
        socket1.emit('projectInfo', {
          action: 'update',
          content: { title: newTitle, subject: newSubject },
        });
        await Promise.all([
          expectUpdateProjectInfo(socket1, 'setting', newTitle, newSubject),
          expectUpdateProjectInfo(socket2, 'landing', newTitle, newSubject),
        ]);
        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
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

    const expectUpdateProjectInfo = (
      socket: Socket,
      eventPage: string,
      title: string,
      subject: string,
    ) => {
      return new Promise<void>((resolve) => {
        socket.on(eventPage, (data) => {
          const { action, domain, content } = data;
          if (domain === 'projectInfo' && action === 'update') {
            expect(content.title).toBe(title);
            expect(content.subject).toBe(subject);
            resolve();
          }
        });
      });
    };
  });
});
