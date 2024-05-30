export const emitJoinLanding = (socket) => {
  return new Promise<void>((res, rej) => {
    socket.on('connect', () => {
      socket.emit('joinLanding');
      socket.off('connect');
      res();
    });
  });
};

export const initLanding = (socket) => {
  return new Promise<void>((res, rej) => {
    socket.on('landing', async (data) => {
      const { action, content, domain } = data;
      if (action !== 'init' || domain !== 'landing') {
        res(await initLanding(socket));
        return;
      }
      socket.off('landing');
      res();
    });
  });
};

export const waitStatusMsg = (socket, memberId) => {
  return new Promise<void>((res, rej) => {
    socket.on('landing', async (data) => {
      const { action, content, domain } = data;
      if (
        action === 'update' &&
        domain === 'member' &&
        content.status === 'on' &&
        content.id === memberId
      ) {
        socket.off('landing');
        res();
        return;
      } else {
        rej();
      }
    });
  });
};

export const waitLandingAndStatusMsgAndReturnId = (
  socket,
  isInitLandingMsg: boolean,
  isUpdateStatusMsg: boolean,
) => {
  return new Promise<void>((res, rej) => {
    socket.on('landing', async (data) => {
      socket.off('landing');
      const { action, content, domain } = data;
      if (action === 'init' && domain === 'landing') {
        if (!isUpdateStatusMsg) {
          await waitLandingAndStatusMsgAndReturnId(socket, true, false);
        }
        res(content.myInfo.id);
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
          res(memberId);
          return;
        }
        res();
      } else {
        rej();
      }
    });
  });
};

export const initLandingAndReturnId = (socket) => {
  return new Promise<void>((res, rej) => {
    socket.on('landing', async (data) => {
      const { action, content, domain } = data;
      if (action !== 'init' || domain !== 'landing') {
        res(await initLanding(socket));
        return;
      }
      socket.off('landing');
      const id = content.myInfo.id;
      res(id);
    });
  });
};
