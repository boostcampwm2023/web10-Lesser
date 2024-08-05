import { LexoRank } from 'lexorank';
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
      const middleRankValue = LexoRank.middle().toString();
      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue: middleRankValue },
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
        content: { title, point, status, epicId, rankValue: middleRankValue },
      };
      socket1.emit('story', requestData);
      await Promise.all([
        expectCreateStory(socket1, epicId, title, point, middleRankValue),
        expectCreateStory(socket2, epicId, title, point, middleRankValue),
      ]);

      socket1.close();
      socket2.close();
    });

    const expectCreateStory = (socket, epicId, title, point, rankValue) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('story');
          expect(action).toBe('create');
          expect(content?.id).toBeDefined();
          expect(content?.epicId).toBe(epicId);
          expect(content?.title).toBe(title);
          expect(content?.point).toBe(point);
          expect(content?.rankValue).toBe(rankValue);
          resolve();
        });
      });
    };

    it('should return created story data when creating multiple stories simultaneously', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);
      const name = '회원';
      const color = 'yellow';
      const rankValue = LexoRank.middle().toString();
      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue },
      };

      socket.emit('epic', requestData);
      const epicId = await getEpicId(socket);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId, rankValue },
      };
      socket.emit('story', requestData);
      socket.emit('story', requestData);

      await new Promise<void>((resolve) => {
        const flag = {};
        socket.on('backlog', async (data) => {
          const { content, action, domain } = data;
          if (domain === 'story' && action === 'create') {
            flag[content.id] = content.rankValue === rankValue.toString();
            if (
              Object.values(flag).length === 2 &&
              Object.values(flag).includes(true) &&
              Object.values(flag).includes(false)
            )
              resolve();
          }
        });
      });

      socket.close();
    });
  });

  describe('story delete', () => {
    it('should return deleted story data', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);

      const name = '회원';
      const color = 'yellow';
      const middleRankValue = LexoRank.middle().toString();

      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue: middleRankValue },
      };
      socket.emit('epic', requestData);
      const [epicId] = await Promise.all([getEpicId(socket)]);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId, rankValue: middleRankValue },
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
      const middleRankValue = LexoRank.middle().toString();

      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue: middleRankValue },
      };
      socket.emit('epic', requestData);
      const [epicId] = await Promise.all([getEpicId(socket)]);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId, rankValue: middleRankValue },
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
      const middleRankValue = LexoRank.middle().toString();
      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue: middleRankValue },
      };
      socket.emit('epic', requestData);
      const [epicId] = await Promise.all([getEpicId(socket)]);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId, rankValue: middleRankValue },
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

    it('should return updated story data when update rankValue within same epic', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);

      const name = '회원';
      const color = 'yellow';
      const middleRankValue = LexoRank.middle().toString();

      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue: middleRankValue },
      };
      socket.emit('epic', requestData);
      const [epicId] = await Promise.all([getEpicId(socket)]);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      requestData = {
        action: 'create',
        content: { title, point, status, epicId, rankValue: middleRankValue },
      };
      socket.emit('story', requestData);
      const storyId = await getStoryId(socket);

      const newRankValue = LexoRank.parse(middleRankValue).genNext().toString();
      requestData = {
        action: 'update',
        content: { id: storyId, rankValue: newRankValue },
      };
      socket.emit('story', requestData);
      await new Promise<void>((resolve) => {
        socket.once('backlog', (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('story');
          expect(action).toBe('update');
          expect(content?.id).toBe(storyId);
          expect(content?.rankValue).toBe(newRankValue);
          resolve();
        });
      });
      socket.close();
    });

    it('should return updated story data when updating multiple stories simultaneously', async () => {
      const socket = await getMemberJoinedLandingPage();
      socket.emit('joinBacklog');
      await initBacklog(socket);

      const name = '회원';
      const color = 'yellow';
      const middleRankValue = LexoRank.middle().toString();

      let requestData: any = {
        action: 'create',
        content: { name, color, rankValue: middleRankValue },
      };
      socket.emit('epic', requestData);
      const epicId = await getEpicId(socket);

      const title = '타이틀';
      const point = 2;
      const status = '시작전';
      const rankValue1 = middleRankValue;
      requestData = {
        action: 'create',
        content: {
          title,
          point,
          status,
          epicId,
          rankValue: rankValue1,
        },
      };
      socket.emit('story', requestData);
      await waitCreateStoryNotify(socket);

      const rankValue2 = LexoRank.parse(rankValue1).genNext().toString();
      requestData.content.rankValue = rankValue2;
      socket.emit('story', requestData);
      await waitCreateStoryNotify(socket);

      const rankValue3 = LexoRank.parse(rankValue2).genNext().toString();
      requestData.content.rankValue = rankValue3;
      socket.emit('story', requestData);
      const storyId3 = await getStoryId(socket);

      const rankValue4 = LexoRank.parse(rankValue3).genNext().toString();
      requestData.content.rankValue = rankValue4;
      socket.emit('story', requestData);
      const storyId4 = await getStoryId(socket);

      const newRankValue = LexoRank.parse(rankValue1).between(
        LexoRank.parse(rankValue2),
      );
      const requestData3 = {
        action: 'update',
        content: { id: storyId3, rankValue: newRankValue.toString() },
      };

      const requestData4 = {
        action: 'update',
        content: { id: storyId4, rankValue: newRankValue.toString() },
      };
      socket.emit('story', requestData3);
      socket.emit('story', requestData4);

      await new Promise<void>((resolve) => {
        const flag = {};
        socket.on('backlog', async (data) => {
          const { content, action, domain } = data;
          if (domain === 'story' && action === 'update') {
            flag[content.id] = content.rankValue === newRankValue.toString();
            if (
              Object.values(flag).length === 2 &&
              Object.values(flag).includes(true) &&
              Object.values(flag).includes(false)
            )
              resolve();
          }
        });
      });
      socket.close();
    });

    const waitCreateStoryNotify = (socket) => {
      return new Promise<void>((resolve) => {
        socket.on('backlog', async (data) => {
          const { content, action, domain } = data;
          if (domain === 'story' && action === 'create') {
            resolve();
          }
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
