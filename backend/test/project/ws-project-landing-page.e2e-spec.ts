import { Socket } from 'socket.io-client';
import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  memberFixture,
  projectPayload,
} from 'test/setup';

describe('WS landing', () => {
  let socket: Socket;

  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  afterEach(async () => {
    socket.close();
  });

  it('should return project data', async () => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const project = await createProject(accessToken, projectPayload, app);
    socket = connectServer(project.id, accessToken);

    return new Promise<void>((resolve, reject) => {
      socket.on('connect', () => {
        socket.emit('joinLanding');
      });

      socket.on('landing', (data) => {
        const { action, domain, content } = data;
        expect(domain).toBe('landing');
        expect(action).toBe('init');
        expect(content.project.title).toBe(projectPayload.title);
        expect(content.project.subject).toBe(projectPayload.subject);
        expect(content.project.createdAt).toBeDefined();
        expect(content.myInfo).toBeDefined();
        expect(content.member).toBeDefined();
        expect(content.sprint).toBeDefined();
        expect(content.memoList).toBeDefined();
        expect(content.link).toBeDefined();
        expect(content.inviteLinkId).toBeDefined();
        resolve();
      });

      handleConnectErrorWithReject(socket, reject);
    });
  });

  it('should return created memoList in landing page data when project member has already created memo', async () => {
    return await new Promise<void>(async (resolve, reject) => {
      const accessToken = (await createMember(memberFixture, app)).accessToken;
      const project = await createProject(accessToken, projectPayload, app);

      //메모 생성
      socket = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket, reject);
      await emitJoinLanding(socket);
      await initLanding(socket);
      const requestData = {
        action: 'create',
        content: { color: 'yellow' },
      };
      socket.emit('memo', requestData);
      await getCreateMemoMsg(socket);
      socket.close();

      //메모 검증
      socket = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket, reject);
      await emitJoinLanding(socket);

      socket.on('landing', (data) => {
        const { action, domain, content } = data;
        const { memoList } = content;
        expect(memoList.length).toBe(1);
        const memo = memoList[0];
        if (action === 'init' && domain === 'landing') {
          expect(memo.id).toBeDefined();
          expect(memo.title).toBe('');
          expect(memo.content).toBe('');
          expect(memo.author).toBe(memberFixture.username);
          expect(memo.author).toBe(memberFixture.username);
          expect(memo.createdAt).toBeDefined();
          expect(memo.color).toBe(requestData.content.color);
          resolve();
        }
      });
    });
  });
});

const handleConnectErrorWithReject = (socket, reject) => {
  socket.on('connect_error', () => {
    reject('connect_error fail');
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
      const { action } = data;
      if (action === 'init') {
        socket.off('landing');
        res();
      }
    });
  });
};

const getCreateMemoMsg = (socket) => {
  return new Promise<void>((res) => {
    socket.on('landing', (data) => {
      const { action, domain } = data;
      expect(domain).toBe('memo');
      expect(action).toBe('create');
      socket.off('landing');
      res();
    });
  });
};
