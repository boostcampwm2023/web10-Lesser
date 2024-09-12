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
import { emitJoinLanding, handleConnectErrorWithReject } from '../ws-common';
import { MemberRole } from 'src/project/enum/MemberRole.enum';

describe('WS Setting', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });

  it('Should return project setting data when leader enters setting page', async () => {
    let socket1: Socket;

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

      socket1.emit('joinSetting');
      socket1.on('error', (e) => reject(e));

      socket1.on('setting', (data) => {
        const { action, domain, content } = data;
        expect(domain).toBe('setting');
        expect(action).toBe('init');

        expect(content.project.title).toBe(projectPayload.title);
        expect(content.project.subject).toBe(projectPayload.subject);
        expect(content.member.length).toBe(2);

        const responseMember1 = content.member.find(
          (member) => member.id === member1.id,
        );
        expect(responseMember1.username).toBe(member1.username);
        expect(responseMember1.imageUrl).toBe(member1.github_image_url);
        expect(responseMember1.role).toBe(MemberRole.LEADER);

        const responseMember2 = content.member.find(
          (member) => member.id === member2.id,
        );
        expect(responseMember2.username).toBe(member2.username);
        expect(responseMember2.imageUrl).toBe(member2.github_image_url);
        expect(responseMember2.role).toBe(MemberRole.MEMBER);
        resolve();
      });
    }).finally(() => {
      socket1.close();
    });
  });

  it('Should close connection when member(not leader) enters setting page', async () => {
    let socket2: Socket;

    return new Promise<void>(async (resolve) => {
      const accessToken1 = (await createMember(memberFixture, app)).accessToken;
      const project = await createProject(accessToken1, projectPayload, app);
      const projectLinkId = await getProjectLinkId(accessToken1, project.id);

      const accessToken2 = (await createMember(memberFixture2, app))
        .accessToken;
      await joinProject(accessToken2, projectLinkId);

      socket2 = connectServer(project.id, accessToken2);
      socket2.emit('joinSetting');
      socket2.on('disconnect', () => {
        resolve();
      });
    }).finally(() => {
      socket2.close();
    });
  });
});
