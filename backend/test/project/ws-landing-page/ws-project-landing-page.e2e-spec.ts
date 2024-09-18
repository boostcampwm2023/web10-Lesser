import { Socket } from 'socket.io-client';
import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  getMemberByAccessToken,
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
  initLanding,
} from '../ws-common';

describe('WS landing', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });

  it('should return project landing page data', async () => {
    let socket1: Socket;
    let socket2: Socket;

    return new Promise<void>(async (resolve, reject) => {
      const accessToken1 = (await createMember(memberFixture, app)).accessToken;
      const member1 = await getMemberByAccessToken(accessToken1);
      const project = await createProject(accessToken1, projectPayload, app);
      const projectLinkId = await getProjectLinkId(accessToken1, project.id);

      const accessToken2 = (await createMember(memberFixture2, app))
        .accessToken;
      const member2 = await getMemberByAccessToken(accessToken2);
      await joinProject(accessToken2, projectLinkId);

      socket1 = connectServer(project.id, accessToken1);
      handleConnectErrorWithReject(socket1, reject);
      await emitJoinLanding(socket1);
      await initLanding(socket1);

      socket2 = connectServer(project.id, accessToken2);
      handleConnectErrorWithReject(socket2, reject);
      socket2.emit('joinLanding');
      socket2.on('error', (e) => reject(e));

      socket2.on('landing', (data) => {
        const { action, domain, content } = data;
        expect(domain).toBe('landing');
        expect(action).toBe('init');

        // project
        expect(content.project.title).toBe(projectPayload.title);
        expect(content.project.subject).toBe(projectPayload.subject);
        expect(content.project.createdAt).toBeDefined();

        // myInfo
        expect(content.myInfo.id).toBe(member2.id);
        expect(content.myInfo.username).toBe(member2.username);
        expect(content.myInfo.imageUrl).toBe(member2.github_image_url);
        expect(content.myInfo.status).toBe('on');

        // member
        expect(content.member[0].id).toBe(member1.id);
        expect(content.member[0].username).toBe(member1.username);
        expect(content.member[0].imageUrl).toBe(member1.github_image_url);
        expect(content.member[0].status).toBe('on');

        // else
        expect(content.sprint).toBeDefined();
        expect(content.memoList).toBeDefined();
        expect(content.linkList).toBeDefined();

        resolve();
      });
    }).finally(() => {
      socket1.close();
      socket2.close();
    });
  });

  it('should return other member status as off when the other member socket is closed', async () => {
    let socket1: Socket;
    let socket2: Socket;

    return new Promise<void>(async (resolve, reject) => {
      const accessToken1 = (await createMember(memberFixture, app)).accessToken;
      const member1 = await getMemberByAccessToken(accessToken1);
      const project = await createProject(accessToken1, projectPayload, app);
      const projectLinkId = await getProjectLinkId(accessToken1, project.id);

      const accessToken2 = (await createMember(memberFixture2, app))
        .accessToken;
      const member2 = await getMemberByAccessToken(accessToken2);
      await joinProject(accessToken2, projectLinkId);

      socket1 = connectServer(project.id, accessToken1);
      handleConnectErrorWithReject(socket1, reject);
      await emitJoinLanding(socket1);
      await initLanding(socket1);

      socket2 = connectServer(project.id, accessToken2);
      handleConnectErrorWithReject(socket2, reject);
      socket2.emit('joinLanding');
      socket2.on('error', (e) => reject(e));

      // socket1 접속 종료
      socket1.close();

      socket2.on('landing', (data) => {
        const { content } = data;
        expect(content.member[0].id).toBe(member1.id);
        expect(content.member[0].username).toBe(member1.username);
        expect(content.member[0].imageUrl).toBe(member1.github_image_url);
        expect(content.member[0].status).toBe('off');

        resolve();
      });
    }).finally(() => {
      socket2.close();
    });
  });

  it('should return created memoList in landing page data when project member has already created memo', async () => {
    let socket: Socket;

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
    }).finally(() => {
      socket.close();
    });
  });
});

const getCreateMemoMsg = (socket) => {
  return new Promise<void>((res) => {
    socket.once('landing', (data) => {
      const { action, domain } = data;
      expect(domain).toBe('memo');
      expect(action).toBe('create');
      res();
    });
  });
};
