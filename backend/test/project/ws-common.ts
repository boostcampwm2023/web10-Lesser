import { Socket } from 'socket.io-client';

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
