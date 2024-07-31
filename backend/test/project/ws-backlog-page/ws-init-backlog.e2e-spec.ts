import { LexoRank } from 'lexorank';
import { Socket } from 'socket.io-client';
import { app, appInit } from 'test/setup';
import { getTwoMemberJoinedLandingPage } from '../ws-common';

describe('WS epic', () => {
  beforeEach(async () => {
    await app.close();
    await appInit();
    await app.listen(3000);
  });

  describe('backlog init', () => {
    it('should return backlog data', async () => {
      const [socket1, socket2] = await getTwoMemberJoinedLandingPage();
      socket1.emit('joinBacklog');
      await initBacklog(socket1);
      const epicName = '회원';
      const epicColor = 'yellow';
      const middleRankValue = LexoRank.middle().toString();
      socket1.emit('epic', {
        action: 'create',
        content: {
          name: epicName,
          color: epicColor,
          rankValue: middleRankValue,
        },
      });
      const epicId = await getEpicId(socket1);
      const storyTitle = '타이틀';
      const storyPoint = 2;
      const storyStatus = '시작전';
      socket1.emit('story', {
        action: 'create',
        content: {
          title: storyTitle,
          point: storyPoint,
          status: storyStatus,
          epicId,
          rankValue: middleRankValue,
        },
      });
      const storyId = await getStoryId(socket1);
      const taskTitle = '타이틀';
      const taskStatus = '시작전';
      const taskExpectedTime = 3.5;
      const taskActualTime = 3.5;
      const taskAssignedMemberId = null;

      socket1.emit('task', {
        action: 'create',
        content: {
          title: taskTitle,
          expectedTime: taskExpectedTime,
          actualTime: taskActualTime,
          status: taskStatus,
          assignedMemberId: taskAssignedMemberId,
          storyId,
          rankValue: middleRankValue,
        },
      });

      const { id: taskId, displayId: taskDisplayId } =
        await getTaskIdAndDisplayId(socket1);

      socket2.emit('joinBacklog');

      await new Promise<void>((resolve, reject) => {
        socket2.once('backlog', async (data) => {
          const { domain, action, content } = data;
          if (domain === 'backlog' && action === 'init') {
            try {
              expect(content.backlog.epicList).toHaveLength(1);
              const epic = content.backlog.epicList[0];
              expect(epic.id).toBe(epicId);
              expect(epic.name).toBe(epicName);
              expect(epic.color).toBe(epicColor);
              expect(epic.storyList).toHaveLength(1);
              const story = epic.storyList[0];
              expect(story.id).toBe(storyId);
              expect(story.title).toBe(storyTitle);
              expect(story.point).toBe(storyPoint);
              expect(story.status).toBe(storyStatus);
              expect(story.taskList).toHaveLength(1);
              const task = story.taskList[0];
              expect(task.id).toBe(taskId);
              expect(task.displayId).toBe(taskDisplayId);
              expect(task.title).toBe(taskTitle);
              expect(task.expectedTime).toBe(taskExpectedTime);
              expect(task.actualTime).toBe(taskActualTime);
              expect(task.status).toBe(taskStatus);
              expect(task.assignedMemberId).toBe(taskAssignedMemberId);
            } catch (e) {
              reject(e);
            }
            resolve();
          }
        });
      }).finally(() => {
        socket1.close();
        socket2.close();
      });
    });

    const getEpicId = (socket) => {
      return new Promise((resolve) => {
        socket.once('backlog', async (data) => {
          const { domain, action, content } = data;
          if (domain === 'epic' && action === 'create') {
            resolve(content.id);
            return;
          }
        });
      });
    };

    const getStoryId = (socket) => {
      return new Promise((resolve) => {
        socket.once('backlog', async (data) => {
          const { domain, action, content } = data;
          if (domain === 'story' && action === 'create') {
            resolve(content.id);
            return;
          }
        });
      });
    };

    const getTaskIdAndDisplayId = (socket) => {
      return new Promise<any>((resolve) => {
        socket.once('backlog', async (data) => {
          const { domain, action, content } = data;
          if (domain === 'task' && action === 'create') {
            resolve({ id: content.id, displayId: content.displayId });
            return;
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
