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
import {
  emitJoinLanding,
  handleConnectErrorWithReject,
  handleErrorWithReject,
} from '../ws-common';
import { Socket } from 'socket.io-client';
import { MemberRole } from 'src/project/enum/MemberRole.enum';

describe('WS role', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });
  describe('role', () => {
    it('should return LEADER role for the member who creates the project and MEMBER role for the member who joins the project', async () => {
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
        await expectRole(socket1, MemberRole.LEADER);

        socket2 = connectServer(project.id, accessToken2);
        handleConnectErrorWithReject(socket2, reject);
        handleErrorWithReject(socket2, reject);
        await emitJoinLanding(socket2);
        await expectRole(socket2, MemberRole.MEMBER);

        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });
    const expectRole = async (socket: Socket, role: string) => {
      await new Promise<void>((resolve, reject) => {
        socket.once('landing', async (data) => {
          const { action, domain, content } = data;
          if (
            action === 'init' &&
            domain === 'landing' &&
            content.myInfo.role === role
          ) {
            resolve();
          } else reject();
        });
      });
    };

    it('should return invite link when member is project leader', async () => {
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
        await expectInviteLink(socket1, MemberRole.LEADER);

        socket2 = connectServer(project.id, accessToken2);
        handleConnectErrorWithReject(socket2, reject);
        handleErrorWithReject(socket2, reject);
        await emitJoinLanding(socket2);
        await expectInviteLink(socket2, MemberRole.MEMBER);

        resolve();
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });

    const expectInviteLink = async (socket: Socket, role: string) => {
      await new Promise<void>((resolve, reject) => {
        socket.once('landing', async (data) => {
          const { action, domain, content } = data;
          if (action === 'init' && domain === 'landing') {
            if (role === MemberRole.LEADER)
              expect(content.inviteLinkId).toBeDefined();
            else if (role === MemberRole.MEMBER)
              expect(content.inviteLinkId).toBeUndefined();
            resolve();
          } else reject();
        });
      });
    };
  });
});
