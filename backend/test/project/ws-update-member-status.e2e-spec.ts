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
} from './ws-common';

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
});
