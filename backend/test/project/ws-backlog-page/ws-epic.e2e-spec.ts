import { LexoRank } from 'lexorank';
import { resolve } from 'path';
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
      const rankValue = LexoRank.middle().toString();
      const requestData = {
        action: 'create',
        content: { name, color, rankValue },
      };
      socket1.emit('epic', requestData);
      await Promise.all([
        expectCreateEpic(socket1, name, color, rankValue),
        expectCreateEpic(socket2, name, color, rankValue),
      ]);
      socket1.close();
      socket2.close();
    });

    const expectCreateEpic = (socket, name, color, rankValue) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('epic');
          expect(action).toBe('create');
          expect(content?.id).toBeDefined();
          expect(content?.name).toBe(name);
          expect(content?.color).toBe(color);
          expect(content?.rankValue).toBe(rankValue);
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
      const rankValue = LexoRank.middle().toString();
      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue },
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
      const rankValue = LexoRank.middle().toString();
      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue },
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
      const rankValue = LexoRank.middle().toString();
      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue },
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

    it('should return updated epic data when update rankValue', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);
      const name1 = '회원';
      const color1 = 'yellow';
      const rankValue1 = LexoRank.middle().toString();
      const requestData1: any = {
        action: 'create',
        content: { name: name1, color: color1, rankValue: rankValue1 },
      };
      socket.emit('epic', requestData1);
      const id1 = await getEpicId(socket);

      const name2 = '회원';
      const color2 = 'yellow';
      const rankValue2 = LexoRank.parse(rankValue1).genNext().toString();
      const requestData2: any = {
        action: 'create',
        content: { name: name2, color: color2, rankValue: rankValue2 },
      };
      socket.emit('epic', requestData2);
      const id2 = await getEpicId(socket);

      const updateRankValue = LexoRank.parse(rankValue2).genNext().toString();
      const requestData3 = {
        action: 'update',
        content: { id: id1, rankValue: updateRankValue },
      };

      socket.emit('epic', requestData3);
      await new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('epic');
          expect(action).toBe('update');
          expect(content?.id).toBe(id1);
          expect(content?.rankValue).toBe(updateRankValue);
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
