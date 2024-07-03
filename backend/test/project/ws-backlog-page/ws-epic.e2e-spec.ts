import { Socket } from 'socket.io-client';
import { app, appInit } from 'test/setup';
import {
  getMemberJoinedLandingPage,
  getTwoMemberJoinedLandingPage,
} from '../ws-common';

describe('WS epic', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  describe('epic create', () => {
    it('should return created epic data', async () => {
      const [socket1, socket2] = await getTwoMemberJoinedLandingPage();
      socket1.emit('joinBacklog');
      socket2.emit('joinBacklog');
      await Promise.all([initBacklog(socket1), initBacklog(socket2)]);
      const name = '회원';
      const color = 'yellow';
      const requestData = {
        action: 'create',
        content: { name, color },
      };
      socket1.emit('epic', requestData);
      await Promise.all([
        expectCreateEpic(socket1, name, color),
        expectCreateEpic(socket2, name, color),
      ]);
      socket1.close();
      socket2.close();
    });

    const expectCreateEpic = (socket, name, color) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('epic');
          expect(action).toBe('create');
          expect(content?.id).toBeDefined();
          expect(content?.name).toBe(name);
          expect(content?.color).toBe(color);
          resolve();
        });
      });
    };
  });

  describe('epic delete', () => {
    it('should return deleted epic data', async () => {
      const [socket1, socket2] = await getTwoMemberJoinedLandingPage();
      socket1.emit('joinBacklog');
      socket2.emit('joinBacklog');
      await Promise.all([initBacklog(socket1), initBacklog(socket2)]);
      const name = '회원';
      const color = 'yellow';
      let requestData: any = {
        action: 'create',
        content: { name, color },
      };
      socket1.emit('epic', requestData);

      const [id] = await Promise.all([getEpicId(socket1), getEpicId(socket2)]);

      requestData = {
        action: 'delete',
        content: { id },
      };

      socket1.emit('epic', requestData);
      await Promise.all([
        expectDeleteEpic(socket1, id),
        expectDeleteEpic(socket2, id),
      ]);

      socket1.close();
      socket2.close();
    });

    const expectDeleteEpic = (socket, id) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('epic');
          expect(action).toBe('delete');
          expect(content?.id).toBe(id);
          resolve();
        });
      });
    };
  });

  describe('epic update', () => {
    it('should return updated epic data when update color', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);
      const name = '회원';
      let color = 'yellow';
      let requestData: any = {
        action: 'create',
        content: { name, color },
      };
      socket.emit('epic', requestData);
      const id = await getEpicId(socket);

      color = 'green';
      requestData = {
        action: 'update',
        content: { id, color },
      };

      socket.emit('epic', requestData);
      await expectColorUpdateEpic(socket, id, color);

      socket.close();
    });

    const expectColorUpdateEpic = (socket, id, color) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('epic');
          expect(action).toBe('update');
          expect(content?.id).toBe(id);
          expect(content?.color).toBe(color);
          resolve();
        });
      });
    };

    it('should return updated epic data when update name and color', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);
      let name = '회원';
      let color = 'yellow';
      let requestData: any = {
        action: 'create',
        content: { name, color },
      };
      socket.emit('epic', requestData);
      const id = await getEpicId(socket);

      name = '프로젝트';
      color = 'purple';
      requestData = {
        action: 'update',
        content: { id, color, name },
      };

      socket.emit('epic', requestData);
      await expectNameAndColorUpdateEpic(socket, id, name, color);

      socket.close();
    });

    const expectNameAndColorUpdateEpic = (socket, id, name, color) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('epic');
          expect(action).toBe('update');
          expect(content?.id).toBe(id);
          expect(content?.color).toBe(color);
          expect(content?.name).toBe(name);
          resolve();
        });
      });
    };
  });
});

const initBacklog = async (socket: Socket) => {
  return await new Promise<void>((resolve, reject) => {
    socket.once('backlog', (data) => {
      const { action, domain } = data;
      if (action === 'init' && domain === 'backlog') {
        resolve();
      } else reject();
    });
  });
};

const getEpicId = (socket) => {
  return new Promise((resolve) => {
    socket.once('backlog', async (data) => {
      const { content, action, domain } = data;
      if (domain === 'epic' && action === 'create') {
        resolve(content.id);
      }
    });
  });
};
