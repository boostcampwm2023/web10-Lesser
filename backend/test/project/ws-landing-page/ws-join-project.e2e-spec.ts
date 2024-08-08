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
  listenAppAndSetPortEnv,
} from 'test/setup';
import {
  emitJoinLanding,
  initLandingAndReturnId,
  expectUpdatedMemberStatus,
  handleConnectErrorWithReject,
  handleErrorWithReject,
  expectProjectJoinMsgAndReturnJoinedId,
} from '../ws-common';

describe('WS join project', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });

  it('should return joined member', async () => {
    let socket1;
    let socket2;
    return new Promise<void>(async (resolve, reject) => {
      // 회원1 회원가입 + 프로젝트 생성
      const accessToken = (await createMember(memberFixture, app)).accessToken;
      const project = await createProject(accessToken, projectPayload, app);
      const projectLinkId = await getProjectLinkId(accessToken, project.id);

      //회원 1 웹소켓 연결
      socket1 = connectServer(project.id, accessToken);
      handleConnectErrorWithReject(socket1, reject);
      handleErrorWithReject(socket1, reject);
      await emitJoinLanding(socket1);
      await initLandingAndReturnId(socket1);

      // 회원2 회원가입 + 프로젝트 참여
      const accessToken2 = (await createMember(memberFixture2, app))
        .accessToken;

      joinProject(accessToken2, projectLinkId);
      const joinedMemberId = await expectProjectJoinMsgAndReturnJoinedId(
        socket1,
        memberFixture2.username,
        memberFixture2.github_image_url,
      );

      socket2 = connectServer(project.id, accessToken2);
      handleConnectErrorWithReject(socket2, reject);
      handleErrorWithReject(socket1, reject);

      await emitJoinLanding(socket2);
      const memberId2 = await initLandingAndReturnId(socket2);
      expect(memberId2).toBe(joinedMemberId);
      await expectUpdatedMemberStatus(socket1, 'on', joinedMemberId);
      resolve();
    }).finally(() => {
      socket1.close();
      socket2.close();
    });
  });
});
