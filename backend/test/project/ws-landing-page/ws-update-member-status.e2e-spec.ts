import {
  app,
  appInit,
  connectServer,
  createMember,
  createProject,
  memberFixture,
  projectPayload,
  getProjectLinkId,
  memberFixture2,
  joinProject,
} from 'test/setup';
import {
  emitJoinLanding,
  initLandingAndReturnId,
  expectUpdatedMemberStatus,
  handleConnectErrorWithReject,
  handleErrorWithReject,
  initLanding,
} from '../ws-common';
import { Socket } from 'socket.io-client';

describe('WS update member status', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  it('should return updated member status', async () => {
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
      handleConnectErrorWithReject(socket1, reject);
      await emitJoinLanding(socket1);
      const memberId = await initLandingAndReturnId(socket1);

      socket2 = connectServer(project.id, accessToken2);
      handleConnectErrorWithReject(socket2, reject);
      await emitJoinLanding(socket2);
      const memberId2 = await initLandingAndReturnId(socket2);
      await expectUpdatedMemberStatus(socket1, 'on', memberId2);

      const status = 'away';
      const requestData = {
        action: 'update',
        content: {
          id: memberId,
          status,
        },
      };

      socket1.emit('member', requestData);
      socket1.on('error', (e) => {
        reject(e);
      });

      await Promise.all([
        expectUpdatedMemberStatus(socket1, status, memberId),
        expectUpdatedMemberStatus(socket2, status, memberId),
      ]);
      resolve();
    }).finally(() => {
      socket1.close();
      socket2.close();
    });
  });

  //이미 접속중인 경우 update를 하지 않고 무시함
  //데이터의 형식이 잘못됨

  it('should broadcast member status as off when socket is disconnected', () => {
    let socket1;
    let socket2;
    return new Promise<void>(async (resolve, reject) => {
      const accessToken = (await createMember(memberFixture, app)).accessToken;
      const project = await createProject(accessToken, projectPayload, app);
      const projectLinkId = await getProjectLinkId(accessToken, project.id);

      const accessToken2 = (await createMember(memberFixture2, app))
        .accessToken;
      await joinProject(accessToken2, projectLinkId);

      socket1 = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket1, reject);
      handleErrorWithReject(socket1, reject);
      await emitJoinLanding(socket1);

      socket2 = connectServer(project.id, accessToken2);
      handleConnectErrorWithReject(socket2, reject);
      await emitJoinLanding(socket2);
      const memberId2 = await initLandingAndReturnId(socket2);
      await expectUpdatedMemberStatus(socket1, 'on', memberId2);

      socket2.close();

      await expectUpdatedMemberStatus(socket1, 'off', memberId2);
      resolve();
    }).finally(() => {
      socket1.close();
    });
  });

  it('should return updated member status when connected to another socket as same member', () => {
    let socket1;
    let socket2;
    return new Promise<void>(async (resolve, reject) => {
      const accessToken = (await createMember(memberFixture, app)).accessToken;
      const project = await createProject(accessToken, projectPayload, app);

      socket1 = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket1, reject);
      handleErrorWithReject(socket1, reject);
      await emitJoinLanding(socket1);
      const memberId = await initLandingAndReturnId(socket1);

      const status = 'away';
      const requestData = {
        action: 'update',
        content: {
          id: memberId,
          status,
        },
      };

      socket1.emit('member', requestData);
      await expectUpdatedMemberStatus(socket1, status, memberId);

      socket2 = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket2, reject);
      handleErrorWithReject(socket2, reject);
      await emitJoinLanding(socket2);
      await expectLandingMyStatus(socket2, status);

      resolve();
    }).finally(() => {
      socket1.close();
      socket2.close();
    });
  });

  it('should reflect the status changed by the same member on a different socket to the current socket', () => {
    let socket1;
    let socket2;
    let socket3;
    return new Promise<void>(async (resolve, reject) => {
      const accessToken = (await createMember(memberFixture, app)).accessToken;
      const project = await createProject(accessToken, projectPayload, app);

      socket1 = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket1, reject);
      handleErrorWithReject(socket1, reject);
      await emitJoinLanding(socket1);
      const memberId = await initLandingAndReturnId(socket1);

      socket2 = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket2, reject);
      handleErrorWithReject(socket2, reject);
      await emitJoinLanding(socket2);
      await initLanding(socket2);

      const status = 'away';
      const requestData = {
        action: 'update',
        content: {
          id: memberId,
          status,
        },
      };

      socket1.emit('member', requestData);
      await expectUpdatedMemberStatus(socket1, status, memberId);
      await expectUpdatedMemberStatus(socket2, status, memberId);

      socket1.close();

      socket3 = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket3, reject);
      handleErrorWithReject(socket3, reject);
      await emitJoinLanding(socket3);
      await expectLandingMyStatus(socket3, status);

      resolve();
    }).finally(() => {
      socket2.close();
      socket3.close();
    });
  });
});

const expectLandingMyStatus = (socket: Socket, expectedStatus: string) => {
  return new Promise<void>((resolve, reject) => {
    socket.once('landing', async (data) => {
      const { action, domain, content } = data;
      if (action === 'init' && domain === 'landing') {
        expect(content.myInfo.status).toBe(expectedStatus);
        resolve();
      } else reject();
    });
  });
};
