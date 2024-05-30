import { Socket } from 'socket.io-client';

export const handleConnectErrorWithReject = (socket, reject) => {
  socket.on('connect_error', () => {
    reject('connect_error fail');
  });
};

//웹소켓 연결시 랜딩페이지 접속
export const emitJoinLanding = (socket: Socket) => {
  return new Promise<void>((resolve) => {
    socket.on('connect', () => {
      socket.emit('joinLanding');
      socket.off('connect');
      resolve();
    });
  });
};

//랜딩페이지 메시지
export const initLanding = (socket: Socket) => {
  return new Promise<void>((resolve, reject) => {
    socket.on('landing', async (data) => {
      const { action, domain } = data;
      if (action === 'init' && domain === 'landing') {
        socket.off('landing');
        resolve();
      } else reject();
    });
  });
};

//랜딩페이지 메시지
export const initLandingAndReturnId = (socket: Socket) => {
  return new Promise<number>((resolve, reject) => {
    socket.on('landing', async (data) => {
      const { action, content, domain } = data;
      if (action === 'init' && domain === 'landing') {
        socket.off('landing');
        const id = content.myInfo.id;
        resolve(id);
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
    socket.on('landing', async (data) => {
      const { content, action, domain } = data;
      if (domain === 'member' && action === 'update') {
        expect(domain).toBe('member');
        expect(action).toBe('update');
        expect(content).toBeDefined();
        expect(content.id).toBe(memberId);
        expect(content.status).toBe(status);
        socket.off('landing');
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
    socket.on('landing', async (data) => {
      socket.off('landing');
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
