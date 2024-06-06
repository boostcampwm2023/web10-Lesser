import { rejects } from 'assert';
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
  initLanding,
  initLandingAndReturnId,
} from './ws-common';

describe('WS memo', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });
  describe('memo create', () => {
    it('should return created memo data when received create memo request', async () => {
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
        await emitJoinLanding(socket1);
        await initLanding(socket1);

        socket2 = connectServer(project.id, accessToken2);
		handleConnectErrorWithReject(socket2, reject);
        await emitJoinLanding(socket2);
        const memberId2 = await initLandingAndReturnId(socket2);
        await expectUpdatedMemberStatus(socket1, 'on', memberId2);

        const requestData = {
          action: 'create',
          content: { color: 'yellow' },
        };
        socket1.emit('memo', requestData);
        socket1.on('error', () => {
          reject();
        });
        await Promise.all([
          expectCreateMemo(
            socket1,
            memberFixture.username,
            requestData.content.color,
          ),
          expectCreateMemo(
            socket2,
            memberFixture.username,
            requestData.content.color,
          ),
        ]);
        socket1.on('exception', (data) => {
          reject(data);
        });
        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });

    it('should succeed create memo when memo is created twice', async () => {
      let socket;
      return new Promise<void>(async (resolve, reject) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);

        socket = connectServer(project.id, accessToken);
        await emitJoinLanding(socket);
        await initLanding(socket);

        const requestData = {
          action: 'create',
          content: { color: 'yellow' },
        };
        socket.emit('memo', requestData);
        expectCreateMemo(
          socket,
          memberFixture.username,
          requestData.content.color,
        );
        socket.emit('memo', requestData);
        expectCreateMemo(
          socket,
          memberFixture.username,
          requestData.content.color,
        );
        socket.on('exception', (data) => {
          reject(data);
        });
        resolve();
      }).finally(() => {
        socket.close();
      });
    });

    it('should return error message list when data format is invalid', async () => {
      let socket;
      return new Promise<void>(async (resolve, reject) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);

        socket = connectServer(project.id, accessToken);
        await emitJoinLanding(socket);
        await initLanding(socket);

        const requestData = {
          action: 'create',
          content: { color: 'invalidColor' },
        };
        socket.emit('memo', requestData);
        socket.on('error', (data) => {
          expect(data.errorList).toBeDefined();
          expect(data.errorList.length).toBeGreaterThan(0);
          resolve();
        });
        socket.on('exception', (data) => {
          reject(data);
        });
      }).finally(() => {
        socket.close();
      });
    });

    it('should return error message list when color property is empty', async () => {
      let socket;
      return new Promise<void>(async (resolve, reject) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);

        socket = connectServer(project.id, accessToken);
        await emitJoinLanding(socket);
        await initLanding(socket);

        const requestData = {
          action: 'create',
        };
        socket.emit('memo', requestData);
        socket.on('error', (data) => {
          expect(data.errorList).toBeDefined();
          expect(data.errorList.length).toBeGreaterThan(0);
          resolve();
        });
        socket.on('exception', (data) => {
          reject(data);
        });
      }).finally(() => {
        socket.close();
      });
    });

    const expectCreateMemo = (socket, author, color) => {
      return new Promise<void>((resolve, reject) => {
        socket.on('landing', async (data) => {
          const { content, action, domain } = data;
          if (domain === 'memo' && action === 'create') {
            expect(domain).toBe('memo');
            expect(action).toBe('create');
            expect(content).toBeDefined();
            expect(content.id).toBeDefined();
            expect(content.title).toBeDefined();
            expect(content.content).toBeDefined();
            expect(content.createdAt).toBeDefined();
            expect(content.author).toBe(author);
            expect(content.color).toBe(color);
            socket.off('landing');
            resolve();
            return;
          } else {
            reject();
          }
        });
      });
    };
  });

  describe('memo delete', () => {
    it('should return deleted memo data when received delete memo request', async () => {
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
        await emitJoinLanding(socket1);
        await initLanding(socket1);

        socket2 = connectServer(project.id, accessToken2);
        await emitJoinLanding(socket2);
        await initLanding(socket2);

        // 메모 생성
        const createRequestData = {
          action: 'create',
          content: { color: 'yellow' },
        };
        socket1.emit('memo', createRequestData);
        socket1.on('error', () => {
          reject();
        });
        const [id1, id2] = await Promise.all([
          getCreatedMemoId(socket1),
          getCreatedMemoId(socket2),
        ]);

        const deleteMemoId = id1;

        // 메모 삭제 테스트
        const deleteRequestData = {
          action: 'delete',
          content: { id: deleteMemoId },
        };

        socket1.emit('memo', deleteRequestData);
        await Promise.all([
          expectDeleteMemo(socket1, deleteMemoId),
          expectDeleteMemo(socket2, deleteMemoId),
        ]);
        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });

    it('should return error message list when data format is invalid', async () => {
      let socket;
      return new Promise<void>(async (resolve) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);

        socket = connectServer(project.id, accessToken);
        await emitJoinLanding(socket);
        await initLanding(socket);

        const requestData = {
          action: 'delete',
          content: { id: 'invalidDataFormat' },
        };
        socket.emit('memo', requestData);
        socket.on('error', (data) => {
          expect(data.errorList).toBeDefined();
          expect(data.errorList.length).toBeGreaterThan(0);
          resolve();
        });
      }).finally(() => {
        socket.close();
      });
    });

    const expectDeleteMemo = (socket, deleteMemoId) => {
      return new Promise<void>((resolve) => {
        socket.on('landing', async (data) => {
          const { domain, action, content } = data;
          if (domain !== 'memo' || action !== 'delete') {
            resolve(await expectDeleteMemo(socket, deleteMemoId));
            return;
          }
          expect(domain).toBe('memo');
          expect(action).toBe('delete');
          expect(content).toBeDefined();
          expect(content.id).toBe(deleteMemoId);
          socket.off('landing');
          resolve();
        });
      });
    };
  });

  describe('memo color update', () => {
    it('should return updated color data when received update color memo request', async () => {
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
        await emitJoinLanding(socket1);
        await initLanding(socket1);

        socket2 = connectServer(project.id, accessToken2);
        await emitJoinLanding(socket2);
        await initLanding(socket2);

        // 메모 생성
        const createRequestData = {
          action: 'create',
          content: { color: 'yellow' },
        };
        socket1.emit('memo', createRequestData);
        socket1.on('error', () => {
          reject();
        });
        const [id1, id2] = await Promise.all([
          getCreatedMemoId(socket1),
          getCreatedMemoId(socket2),
        ]);
        const updateColorMemoId = id1;
        const updateColor = 'blue';

        // 메모 색상 변경 테스트
        const deleteRequestData = {
          action: 'colorUpdate',
          content: { id: updateColorMemoId, color: updateColor },
        };
        socket1.emit('memo', deleteRequestData);
        await Promise.all([
          expectUpdateColorMemo(socket1, updateColorMemoId, updateColor),
          expectUpdateColorMemo(socket2, updateColorMemoId, updateColor),
        ]);
        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });

    const expectUpdateColorMemo = (socket, updateColorMemoId, updateColor) => {
      return new Promise<void>((resolve) => {
        socket.on('landing', async (data) => {
          const { domain, action, content } = data;
          if (domain !== 'memo' || action !== 'colorUpdate') {
            resolve(
              await expectUpdateColorMemo(
                socket,
                updateColorMemoId,
                updateColor,
              ),
            );
            return;
          }
          expect(domain).toBe('memo');
          expect(action).toBe('colorUpdate');
          expect(content).toBeDefined();
          expect(content.id).toBe(updateColorMemoId);
          expect(content.color).toBe(updateColor);
          socket.off('landing');
          resolve();
        });
      });
    };

    it('should return error message list when data format is invalid', async () => {
      let socket;
      return new Promise<void>(async (resolve) => {
        const accessToken = (await createMember(memberFixture, app))
          .accessToken;
        const project = await createProject(accessToken, projectPayload, app);

        socket = connectServer(project.id, accessToken);
        await emitJoinLanding(socket);
        await initLanding(socket);

        const requestData = {
          action: 'colorUpdate',
          content: { id: 'invalidDataFormat', color: 'invalidColor' },
        };
        socket.emit('memo', requestData);
        socket.on('error', (data) => {
          expect(data.errorList).toBeDefined();
          expect(data.errorList.length).toBe(2);
          resolve();
        });
      }).finally(() => {
        socket.close();
      });
    });
  });

  const getCreatedMemoId = (socket) => {
    return new Promise<number>((resolve) => {
      socket.on('landing', async (data) => {
        const { action, content, domain } = data;
        if (action !== 'create' || domain !== 'memo') {
          resolve(await getCreatedMemoId(socket));
          return;
        }
        socket.off('landing');
        resolve(content.id);
      });
    });
  };
});
