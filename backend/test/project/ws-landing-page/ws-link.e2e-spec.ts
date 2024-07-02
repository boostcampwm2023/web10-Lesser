import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  getProjectLinkId,
  joinProject,
  memberFixture,
  memberFixture2,
  projectPayload,
} from 'test/setup';
import {
  emitJoinLanding,
  expectUpdatedMemberStatus,
  handleConnectErrorWithReject,
  handleErrorWithReject,
  initLanding,
  initLandingAndReturnId,
} from '../ws-common';

describe('WS link', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });
  describe('link create', () => {
    it('should return created link data when received create link request', async () => {
      let socket1;
      let socket2;
      return new Promise<void>(async (resolve, reject) => {
        // 회원1 회원가입 + 프로젝트 생성
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);
        const projectLinkId = await getProjectLinkId(accessToken, project.id);

        // 회원2 회원가입 + 프로젝트 참여
        const accessToken2 = (await createMember(memberFixture2, app))
          .accessToken;
        await joinProject(accessToken2, projectLinkId);

        socket1 = connectServer(project.id, accessToken);
        handleConnectErrorWithReject(socket1, reject);
        handleErrorWithReject(socket1, reject);
        await emitJoinLanding(socket1);
        await initLanding(socket1);

        socket2 = connectServer(project.id, accessToken2);
        handleConnectErrorWithReject(socket2, reject);
        handleErrorWithReject(socket2, reject);
        await emitJoinLanding(socket2);
        const memberId2 = await initLandingAndReturnId(socket2);
        await expectUpdatedMemberStatus(socket1, 'on', memberId2);

        const url = 'https://www.urldecoder.org/ko/';
        const description = '피그마';
        const requestData = {
          action: 'create',
          content: { url, description },
        };
        socket1.emit('link', requestData);
        await Promise.all([
          expectCreateLink(socket1, url, description),
          expectCreateLink(socket2, url, description),
        ]);
        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });

    const expectCreateLink = (socket, url, description) => {
      return new Promise<void>((resolve, reject) => {
        socket.once('landing', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('link');
          expect(action).toBe('create');
          expect(content?.description).toBe(description);
          expect(content?.id).toBeDefined();
          expect(content?.url).toBe(url);
          expect(content?.description).toBe(description);
          resolve(content.id);
        });
      });
    };

    it('should return error when URL format is invalid', () => {
      let socket;
      return new Promise<void>(async (resolve, reject) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);

        socket = connectServer(project.id, accessToken);
        await emitJoinLanding(socket);
        await initLanding(socket);

        const url = '유효하지 않은 URL';
        const description = '피그마';
        const requestData = {
          action: 'create',
          content: { url, description },
        };
        socket.emit('link', requestData);
        socket.on('error', (data) => {
          expect(data.errorList).toBeDefined();
          expect(data.errorList.length).toBeGreaterThan(0);
          expect(data.errorList).toContain('invalid url format');
          resolve();
        });
        socket.on('exception', (data) => {
          reject(data);
        });
      }).finally(() => {
        socket.close();
      });
    });

    it('should return created linkList in landing page data when project member has already created external link', async () => {
      let socket;

      return await new Promise<void>(async (resolve, reject) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);

        //메모 생성
        socket = connectServer(project.id, accessToken);
        handleConnectErrorWithReject(socket, reject);
        handleErrorWithReject(socket, reject);

        await emitJoinLanding(socket);
        await initLanding(socket);

        const url = 'https://www.urldecoder.org/ko/';
        const description = '피그마';
        const requestData = {
          action: 'create',
          content: { url, description },
        };
        socket.emit('link', requestData);

        await getCreateLinkMsg(socket);
        socket.close();

        socket = connectServer(project.id, accessToken);
        handleConnectErrorWithReject(socket, reject);
        handleErrorWithReject(socket, reject);
        await emitJoinLanding(socket);

        socket.on('landing', (data) => {
          const { action, domain, content } = data;
          const { linkList } = content;
          if (action === 'init' && domain === 'landing') {
            expect(linkList.length).toBe(1);
            const link = linkList[0];
            expect(link.id).toBeDefined();
            expect(link.description).toBe(description);
            expect(link.url).toBe(url);
            resolve();
          }
        });
      }).finally(() => {
        socket.close();
      });
    });
    const getCreateLinkMsg = (socket) => {
      return new Promise<void>((res) => {
        socket.once('landing', (data) => {
          const { action, domain } = data;
          expect(domain).toBe('link');
          expect(action).toBe('create');
          res();
        });
      });
    };
  });
  describe('link delete', () => {
    it('should return delete link data when received delete link request', async () => {
      let socket1;
      let socket2;
      return new Promise<void>(async (resolve, reject) => {
        // 회원1 회원가입 + 프로젝트 생성
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);
        const projectLinkId = await getProjectLinkId(accessToken, project.id);

        // 회원2 회원가입 + 프로젝트 참여
        const accessToken2 = (await createMember(memberFixture2, app))
          .accessToken;
        await joinProject(accessToken2, projectLinkId);

        socket1 = connectServer(project.id, accessToken);
        handleConnectErrorWithReject(socket1, reject);
        handleErrorWithReject(socket1, reject);
        await emitJoinLanding(socket1);
        await initLanding(socket1);

        const url = 'https://www.urldecoder.org/ko/';
        const description = '피그마';
        const requestData = {
          action: 'create',
          content: { url, description },
        };
        socket1.emit('link', requestData);
        const linkId = await expectCreateLinkAndReturnFirstLinkId(
          socket1,
          url,
          description,
        );

        socket2 = connectServer(project.id, accessToken2);
        handleConnectErrorWithReject(socket2, reject);
        handleErrorWithReject(socket2, reject);
        await emitJoinLanding(socket2);
        const memberId2 = await initLandingAndReturnId(socket2);
        await expectUpdatedMemberStatus(socket1, 'on', memberId2);

        const deleteRequestData = {
          action: 'delete',
          content: {
            id: linkId,
          },
        };
        socket1.emit('link', deleteRequestData);
        await Promise.all([
          expectDeleteLink(socket1, linkId),
          expectDeleteLink(socket2, linkId),
        ]);
        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });
    const expectCreateLinkAndReturnFirstLinkId = (socket, url, description) => {
      return new Promise<void>((resolve, reject) => {
        socket.once('landing', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('link');
          expect(action).toBe('create');
          expect(content?.description).toBe(description);
          expect(content?.id).toBeDefined();
          expect(content?.url).toBe(url);
          expect(content?.description).toBe(description);
          resolve(content.id);
        });
      });
    };

    const expectDeleteLink = (socket, linkId) => {
      return new Promise<void>((resolve, reject) => {
        socket.once('landing', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('link');
          expect(action).toBe('delete');
          expect(content?.id).toBe(linkId);
          resolve();
        });
      });
    };
  });
});
