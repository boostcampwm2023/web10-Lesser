import { Socket } from 'socket.io-client';
import { app, appInit } from 'test/setup';
import {
  getMemberJoinedLandingPage,
  getTwoMemberJoinedLandingPage,
} from '../ws-common';

describe('WS story', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  describe('story create', () => {
    it('should return created story data', async () => {
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
      const [epicId] = await Promise.all([
        getEpicId(socket1),
        getEpicId(socket2),
      ]);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId },
      };
      socket1.emit('story', requestData);
      await Promise.all([
        expectCreateStory(socket1, epicId, title, point),
        expectCreateStory(socket2, epicId, title, point),
      ]);

      socket1.close();
      socket2.close();
    });

    const expectCreateStory = (socket, epicId, title, point) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('story');
          expect(action).toBe('create');
          expect(content?.id).toBeDefined();
          expect(content?.epicId).toBe(epicId);
          expect(content?.title).toBe(title);
          expect(content?.point).toBe(point);
          resolve();
        });
      });
    };
  });

  describe('story delete', () => {
    it('should return deleted story data', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);

      const name = '회원';
      const color = 'yellow';
      let requestData: any = {
        action: 'create',
        content: { name, color },
      };
      socket.emit('epic', requestData);
      const [epicId] = await Promise.all([getEpicId(socket)]);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId },
      };
      socket.emit('story', requestData);
      const storyId = await getStoryId(socket);
      requestData = {
        action: 'delete',
        content: { id: storyId },
      };
      socket.emit('story', requestData);
      await expectDeleteStory(socket, storyId);

      socket.close();
    });

    const expectDeleteStory = (socket, id) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('story');
          expect(action).toBe('delete');
          expect(content?.id).toBe(id);
          resolve();
        });
      });
    };
  });

  describe('story update', () => {
    it('should return updated story data when update color', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);

      const name = '회원';
      const color = 'yellow';
      let requestData: any = {
        action: 'create',
        content: { name, color },
      };
      socket.emit('epic', requestData);
      const [epicId] = await Promise.all([getEpicId(socket)]);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId },
      };
      socket.emit('story', requestData);
      const storyId = await getStoryId(socket);

      const newTitle = '뉴타이틀';
      requestData = {
        action: 'update',
        content: { id: storyId, title: newTitle },
      };
      socket.emit('story', requestData);
      await expectTitleUpdateStory(socket, storyId, newTitle);

      socket.close();
    });

    const expectTitleUpdateStory = (socket, id, title) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('story');
          expect(action).toBe('update');
          expect(content?.id).toBe(id);
          expect(content?.title).toBe(title);
          resolve();
        });
      });
    };

    it('should return error when updated property is do not exist', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);

      const name = '회원';
      const color = 'yellow';
      let requestData: any = {
        action: 'create',
        content: { name, color },
      };
      socket.emit('epic', requestData);
      const [epicId] = await Promise.all([getEpicId(socket)]);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId },
      };
      socket.emit('story', requestData);
      const storyId = await getStoryId(socket);

      requestData = {
        action: 'update',
        content: { id: storyId },
      };
      socket.emit('story', requestData);
      await new Promise<void>((resolve) => {
        socket.on('error', () => {
          resolve();
        });
      });
      socket.close();
    });
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

const getStoryId = (socket) => {
  return new Promise((resolve) => {
    socket.once('backlog', async (data) => {
      const { content, action, domain } = data;
      if (domain === 'story' && action === 'create') {
        resolve(content.id);
      }
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
