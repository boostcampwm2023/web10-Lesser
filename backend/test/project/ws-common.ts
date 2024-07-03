import { Socket } from 'socket.io-client';
import {
  app,
  connectServer,
  createMember,
  createProject,
  getProjectLinkId,
  joinProject,
  memberFixture,
  memberFixture2,
  projectPayload,
} from 'test/setup';

export const getMemberJoinedLandingPage = async () => {
  let socket;
  await new Promise<void>(async (resolve, reject) => {
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const project = await createProject(accessToken, projectPayload, app);

    socket = connectServer(project.id, accessToken);
    handleConnectErrorWithReject(socket, reject);
    handleErrorWithReject(socket, reject);
    await emitJoinLanding(socket);
    await initLanding(socket);
    resolve();
  });
  return socket;
};

export const getTwoMemberJoinedLandingPage = async () => {
  let socket1;
  let socket2;
  await new Promise<void>(async (resolve, reject) => {
    // 회원1 회원가입 + 프로젝트 생성
    const accessToken = (await createMember(memberFixture, app)).accessToken;
    const project = await createProject(accessToken, projectPayload, app);
    const projectLinkId = await getProjectLinkId(accessToken, project.id);

    // 회원2 회원가입 + 프로젝트 참여
    const accessToken2 = (await createMember(memberFixture2, app)).accessToken;
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
    resolve();
  });
  return [socket1, socket2];
};

export const handleConnectErrorWithReject = (
  socket: Socket,
  reject: Function,
) => {
  socket.on('connect_error', () => {
    reject('connect_error fail');
  });
};

export const handleErrorWithReject = (socket: Socket, reject: Function) => {
  socket.on('error', (e) => {
    reject(e);
  });
};

//웹소켓 연결시 랜딩페이지 접속
export const emitJoinLanding = (socket: Socket) => {
  return new Promise<void>((resolve) => {
    socket.once('connect', () => {
      socket.emit('joinLanding');
      resolve();
    });
  });
};

//랜딩페이지 메시지
export const initLanding = (socket: Socket) => {
  return new Promise<void>((resolve, reject) => {
    socket.once('landing', async (data) => {
      const { action, domain } = data;
      if (action === 'init' && domain === 'landing') {
        resolve();
      } else reject();
    });
  });
};

//랜딩페이지 메시지
export const initLandingAndReturnId = (socket: Socket) => {
  return new Promise<number>((resolve, reject) => {
    socket.once('landing', async (data) => {
      const { action, content, domain } = data;
      if (action === 'init' && domain === 'landing') {
        const id = content.myInfo.id;
        resolve(id);
      } else reject(data);
    });
  });
};

export const expectProjectJoinMsgAndReturnJoinedId = (
  socket: Socket,
  username: string,
  imageUrl: string,
) => {
  return new Promise<number>((resolve, reject) => {
    socket.once('landing', async (data) => {
      const { action, content, domain } = data;
      if (action === 'create' && domain === 'member') {
        expect(content.username).toBe(username);
        expect(content.imageUrl).toBe(imageUrl);
        expect(content.status).toBe('off');
        const joinedMemberId = content.id;
        resolve(joinedMemberId);
      } else reject();
    });
  });
};

export const returnJoinedIdAndJoinProject = (
  socket: Socket,
  username: string,
  imageUrl: string,
) => {
  return new Promise<number>((resolve, reject) => {
    socket.once('landing', async (data) => {
      const { action, content, domain } = data;
      if (action === 'create' && domain === 'member') {
        expect(content.username).toBe(username);
        expect(content.imageUrl).toBe(imageUrl);
        expect(content.status).toBe('off');
        const joinedMemberId = content.id;
        resolve(joinedMemberId);
      } else reject();
    });
  });
};

export const expectUpdatedMemberStatus = (
  socket: Socket,
  status: string,
  memberId: number,
) => {
  return new Promise<void>((resolve, reject) => {
    socket.once('landing', async (data) => {
      const { content, action, domain } = data;
      if (domain === 'member' && action === 'update') {
        expect(domain).toBe('member');
        expect(action).toBe('update');
        expect(content).toBeDefined();
        expect(content.id).toBe(memberId);
        expect(content.status).toBe(status);
        resolve();
      } else {
        reject();
      }
    });
  });
};

export const waitLandingAndStatusMsgAndReturnId = (
  socket: Socket,
  isInitLandingMsg: boolean,
  isUpdateStatusMsg: boolean,
) => {
  return new Promise<void>((resolve, reject) => {
    socket.once('landing', async (data) => {
      const { action, content, domain } = data;
      if (action === 'init' && domain === 'landing') {
        if (!isUpdateStatusMsg) {
          await waitLandingAndStatusMsgAndReturnId(socket, true, false);
        }
        resolve(content.myInfo.id);
        return;
      } else if (
        action === 'update' &&
        domain === 'member' &&
        content.status === 'on'
      ) {
        if (!isInitLandingMsg) {
          const memberId = await waitLandingAndStatusMsgAndReturnId(
            socket,
            false,
            true,
          );
          resolve(memberId);
          return;
        }
        resolve();
      } else {
        reject();
      }
    });
  });
};
