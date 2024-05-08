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

describe('WS memo', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  it('should return created memo data when received create memo request', async () => {
    let socket1;
    let socket2;
    return new Promise<void>(async (resolve, reject) => {
      // 회원1 회원가입 + 프로젝트 생성
      const accessToken = (await createMember(memberFixture, app)).accessToken;
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

      const requestData = {
        action: 'create',
        content: { color: 'yellow' },
      };
      socket1.emit('memo', requestData);
      socket1.on('error', () => {
        reject();
      });
      await Promise.all([
        expectMemo(socket1, memberFixture.username, requestData.content.color),
        expectMemo(socket2, memberFixture.username, requestData.content.color),
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
      const accessToken = (await createMember(memberFixture, app)).accessToken;
      const project = await createProject(accessToken, projectPayload, app);

      socket = connectServer(project.id, accessToken);
      await emitJoinLanding(socket);
      await initLanding(socket);

      const requestData = {
        action: 'create',
        content: { color: 'yellow' },
      };
      socket.emit('memo', requestData);
      expectMemo(socket, memberFixture.username, requestData.content.color);
      socket.emit('memo', requestData);
      expectMemo(socket, memberFixture.username, requestData.content.color);
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
      const accessToken = (await createMember(memberFixture, app)).accessToken;
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
      const accessToken = (await createMember(memberFixture, app)).accessToken;
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
});

const expectMemo = (socket, author, color) => {
  return new Promise<void>((res) => {
    socket.on('landing', (data) => {
      const { content, action, domain } = data;
      expect(domain).toBe('memo');
      expect(action).toBe('create');
      expect(content.id).toBeDefined();
      expect(content.title).toBeDefined();
      expect(content.content).toBeDefined();
      expect(content.createdAt).toBeDefined();
      expect(content.author).toBe(author);
      expect(content.color).toBe(color);
      socket.off('landing');
      res();
    });
  });
};

const emitJoinLanding = (socket) => {
  return new Promise<void>((res, rej) => {
    socket.on('connect', () => {
      socket.emit('joinLanding');
      socket.off('connect');
      res();
    });
  });
};

const initLanding = (socket) => {
  return new Promise<void>((res, rej) => {
    socket.on('landing', (data) => {
      const { action, content, domain } = data;
      if (action === 'init') {
        socket.off('landing');
        res();
      }
    });
  });
};
