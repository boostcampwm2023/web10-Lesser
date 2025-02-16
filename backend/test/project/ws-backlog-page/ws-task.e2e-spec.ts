import { LexoRank } from 'lexorank';
import { Socket } from 'socket.io-client';
import { app, appInit, listenAppAndSetPortEnv } from 'test/setup';
import {
  getMemberJoinedLandingPage,
  getTwoMemberJoinedLandingPage,
} from '../ws-common';

describe('WS task', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await listenAppAndSetPortEnv(app);
  });

  describe('task create', () => {
    it('should return created task data', async () => {
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

      const storyTitle = '타이틀';
      const storyPoint = 2;
      const storyStatus = '시작전';
      requestData = {
        action: 'create',
        content: {
          title: storyTitle,
          point: storyPoint,
          status: storyStatus,
          epicId,
          rankValue: middleRankValue,
        },
      };
      socket1.emit('story', requestData);
      const [storyId] = await Promise.all([
        getStoryId(socket1),
        getStoryId(socket2),
      ]);

      await testCreateTask(
        socket1,
        socket2,
        '타이틀',
        '시작전',
        storyId,
        null,
        null,
        null,
        middleRankValue,
      );

      await testCreateTask(
        socket1,
        socket2,
        '타이틀',
        '시작전',
        storyId,
        2.1,
        3.3,
        null,
        LexoRank.parse(middleRankValue).genNext().toString(),
      );

      await testCreateTask(
        socket1,
        socket2,
        '타이틀',
        '진행중',
        storyId,
        null,
        null,
        null,
        LexoRank.parse(middleRankValue).genNext().genNext().toString(),
      );

      await testCreateTask(
        socket1,
        socket2,
        '타이틀',
        '완료',
        storyId,
        null,
        null,
        null,
        LexoRank.parse(middleRankValue)
          .genNext()
          .genNext()
          .genNext()
          .toString(),
      );

      socket1.close();
      socket2.close();
    });

    const testCreateTask = async (
      socket1,
      socket2,
      title,
      status,
      storyId,
      expectedTime,
      actualTime,
      assignedMemberId,
      rankValue,
    ) => {
      const requestData = {
        action: 'create',
        content: {
          title,
          status,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue,
        },
      };
      socket1.emit('task', requestData);

      await Promise.all([
        expectCreateTask(
          socket1,
          title,
          status,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue,
        ),
        expectCreateTask(
          socket2,
          title,
          status,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue,
        ),
      ]);
    };

    const expectCreateTask = (
      socket,
      title,
      status,
      storyId,
      expectedTime,
      actualTime,
      assignedMemberId,
      rankValue,
    ) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('task');
          expect(action).toBe('create');
          expect(content?.id).toBeDefined();
          expect(content?.displayId).toBeDefined();
          expect(content?.title).toBe(title);
          expect(content?.status).toBe(status);
          expect(content?.storyId).toBe(storyId);
          expect(content?.actualTime).toBe(actualTime);
          expect(content?.expectedTime).toBe(expectedTime);
          expect(content?.assignedMemberId).toBe(assignedMemberId);
          expect(content?.rankValue).toBe(rankValue);
          resolve();
        });
      });
    };

    it('should return created task data when creating multiple tasks simultaneously', async () => {
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
      const storyId = await getStoryId(socket);

      let taskTitle = '타이틀';
      let taskStatus = '시작전';
      let expectedTime = null;
      let actualTime = null;
      let assignedMemberId = null;
      requestData = {
        action: 'create',
        content: {
          title: taskTitle,
          status: taskStatus,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue,
        },
      };
      socket.emit('task', requestData);
      socket.emit('task', requestData);

      await new Promise<void>((resolve) => {
        const flag = {};
        socket.on('backlog', async (data) => {
          const { content, action, domain } = data;
          if (domain === 'task' && action === 'create') {
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

  describe('task delete', () => {
    it('should return deleted task data', async () => {
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

      let taskTitle = '타이틀';
      let taskStatus = '시작전';
      let expectedTime = null;
      let actualTime = null;
      let assignedMemberId = null;
      requestData = {
        action: 'create',
        content: {
          title: taskTitle,
          status: taskStatus,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue: middleRankValue,
        },
      };
      socket.emit('task', requestData);
      const taskId = await getTaskId(socket);

      requestData = {
        action: 'delete',
        content: { id: taskId },
      };
      socket.emit('task', requestData);
      await expectDeleteTask(socket, taskId);

      socket.close();
    });

    const expectDeleteTask = (socket, id) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('task');
          expect(action).toBe('delete');
          expect(content?.id).toBe(id);
          resolve();
        });
      });
    };
  });

  describe('task update', () => {
    it('should return updated task data when update color', async () => {
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

      let taskTitle = '타이틀';
      let taskStatus = '시작전';
      let expectedTime = null;
      let actualTime = null;
      let assignedMemberId = null;
      requestData = {
        action: 'create',
        content: {
          title: taskTitle,
          status: taskStatus,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue: middleRankValue,
        },
      };
      socket.emit('task', requestData);
      const taskId = await getTaskId(socket);

      const newTitle = 'newTitle';
      requestData = {
        action: 'update',
        content: { id: taskId, title: newTitle },
      };
      socket.emit('task', requestData);
      await expectTitleUpdateTask(socket, taskId, newTitle);

      const newExpectedTime = 5;
      const newActualTime = 3;
      const newStatus = '완료';
      requestData = {
        action: 'update',
        content: {
          id: taskId,
          expectedTime: newExpectedTime,
          actualTime: newActualTime,
          status: newStatus,
        },
      };
      socket.emit('task', requestData);
      await expectTimeAndStatusWhenUpdateTask(
        socket,
        taskId,
        newExpectedTime,
        newActualTime,
        newStatus,
      );
      socket.close();
    });

    const expectTitleUpdateTask = (socket, id, title) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('task');
          expect(action).toBe('update');
          expect(content?.id).toBe(id);
          expect(content?.title).toBe(title);
          resolve();
        });
      });
    };

    const expectTimeAndStatusWhenUpdateTask = (
      socket,
      id,
      expectedTime,
      actualTime,
      status,
    ) => {
      return new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('task');
          expect(action).toBe('update');
          expect(content?.id).toBe(id);
          expect(content?.expectedTime).toBe(expectedTime);
          expect(content?.actualTime).toBe(actualTime);
          expect(content?.status).toBe(status);
          resolve();
        });
      });
    };

    it('should return updated task data when data is a falsy value', async () => {
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

      let taskTitle = '타이틀';
      let taskStatus = '시작전';
      let expectedTime = null;
      let actualTime = null;
      let assignedMemberId = null;
      requestData = {
        action: 'create',
        content: {
          title: taskTitle,
          status: taskStatus,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue: middleRankValue,
        },
      };
      socket.emit('task', requestData);
      const taskId = await getTaskId(socket);

      const newActualTime = 0;
      const newExpectedTime = 0;
      requestData = {
        action: 'update',
        content: {
          id: taskId,
          actualTime: newActualTime,
          expectedTime: newExpectedTime,
        },
      };
      socket.emit('task', requestData);

      await new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('task');
          expect(action).toBe('update');
          expect(content?.id).toBe(taskId);
          expect(content?.actualTime).toBe(newActualTime);
          expect(content?.expectedTime).toBe(newExpectedTime);
          resolve();
        });
      });

      socket.close();
    });

    it('should return updated task data when update rankValue within same story', async () => {
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

      let taskTitle = '타이틀';
      let taskStatus = '시작전';
      let expectedTime = null;
      let actualTime = null;
      let assignedMemberId = null;
      requestData = {
        action: 'create',
        content: {
          title: taskTitle,
          status: taskStatus,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue: middleRankValue,
        },
      };
      socket.emit('task', requestData);
      const taskId = await getTaskId(socket);

      const newRankValue = LexoRank.parse(middleRankValue).genNext().toString();
      requestData = {
        action: 'update',
        content: {
          id: taskId,
          rankValue: newRankValue,
        },
      };
      socket.emit('task', requestData);

      await new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('task');
          expect(action).toBe('update');
          expect(content?.id).toBe(taskId);
          expect(content?.rankValue).toBe(newRankValue);
          resolve();
        });
      });

      socket.close();
    });

    it('should return updated task data when update rankValue within same story', async () => {
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
      requestData = {
        action: 'create',
        content: { title, point, status, epicId, rankValue: middleRankValue },
      };
      socket.emit('story', requestData);
      const storyId1 = await getStoryId(socket);

      requestData = {
        action: 'create',
        content: {
          title,
          point,
          status,
          epicId,
          rankValue: LexoRank.parse(middleRankValue).genNext().toString(),
        },
      };
      socket.emit('story', requestData);
      const storyId2 = await getStoryId(socket);

      let taskTitle = '타이틀';
      let taskStatus = '시작전';
      let expectedTime = null;
      let actualTime = null;
      let assignedMemberId = null;
      requestData = {
        action: 'create',
        content: {
          title: taskTitle,
          status: taskStatus,
          storyId: storyId1,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue: middleRankValue,
        },
      };
      socket.emit('task', requestData);
      const taskId = await getTaskId(socket);

      const newRankValue = LexoRank.middle().toString();
      requestData = {
        action: 'update',
        content: {
          id: taskId,
          stroyId: storyId2,
          rankValue: newRankValue,
        },
      };
      socket.emit('task', requestData);

      await new Promise<void>((resolve) => {
        socket.once('backlog', async (data) => {
          const { content, action, domain } = data;
          expect(domain).toBe('task');
          expect(action).toBe('update');
          expect(content?.id).toBe(taskId);
          expect(content?.rankValue).toBe(newRankValue);
          resolve();
        });
      });

      socket.close();
    });

    it('should return updated task data when updating multiple tasks simultaneously', async () => {
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
      requestData = {
        action: 'create',
        content: { title, point, status, epicId, rankValue: middleRankValue },
      };
      socket.emit('story', requestData);
      const storyId = await getStoryId(socket);

      let taskTitle = '타이틀';
      let taskStatus = '시작전';
      let expectedTime = null;
      let actualTime = null;
      let assignedMemberId = null;
      const rankValue1 = middleRankValue;
      requestData = {
        action: 'create',
        content: {
          title: taskTitle,
          status: taskStatus,
          storyId,
          expectedTime,
          actualTime,
          assignedMemberId,
          rankValue: rankValue1,
        },
      };

      socket.emit('task', requestData);
      await waitCreateTaskNotify(socket);

      const rankValue2 = LexoRank.parse(rankValue1).genNext().toString();
      requestData.content.rankValue = rankValue2;
      socket.emit('task', requestData);
      await waitCreateTaskNotify(socket);

      const rankValue3 = LexoRank.parse(rankValue2).genNext().toString();
      requestData.content.rankValue = rankValue3;
      socket.emit('task', requestData);
      const taskId3 = await getTaskId(socket);

      const rankValue4 = LexoRank.parse(rankValue3).genNext().toString();
      requestData.content.rankValue = rankValue4;
      socket.emit('task', requestData);
      const taskId4 = await getTaskId(socket);

      const newRankValue = LexoRank.parse(rankValue1).between(
        LexoRank.parse(rankValue2),
      );

      const requestData3 = {
        action: 'update',
        content: { id: taskId3, rankValue: newRankValue.toString() },
      };
      const requestData4 = {
        action: 'update',
        content: { id: taskId4, rankValue: newRankValue.toString() },
      };
      socket.emit('task', requestData3);
      socket.emit('task', requestData4);

      await new Promise<void>((resolve) => {
        const flag = {};
        socket.on('backlog', async (data) => {
          const { content, action, domain } = data;
          if (domain === 'task' && action === 'update') {
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

    const waitCreateTaskNotify = (socket) => {
      return new Promise<void>((resolve) => {
        socket.on('backlog', async (data) => {
          const { content, action, domain } = data;
          if (domain === 'task' && action === 'create') {
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

const getTaskId = (socket) => {
  return new Promise((resolve) => {
    socket.once('backlog', async (data) => {
      const { content, action, domain } = data;
      if (domain === 'task' && action === 'create') {
        resolve(content.id);
      }
    });
  });
};
