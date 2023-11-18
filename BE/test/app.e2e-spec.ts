import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('e2e 테스트 시작', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });
  describe('backlogs Test', () => {
    const epicURI = '/api/backlogs/Epic';
    const storyURI = '/api/backlogs/Story';
    const taskURI = '/api/backlogs/Task';
    let postEpicResponse;
    let postStoryResponse;
    let postTaskResponse;
    const postEpicPayload = { projectId: 3, epicTitle: '이거슨타이틀' };
    const postStoryPayload = {
      projectId: 3,
      story: {
        epicId: null,
        title: '회원은 로그인을 할 수 없다.',
      },
    };
    const postTaskPayload = {
      projectId: 1,
      task: {
        epicId: null,
        storyId: null,
        userId: 1,
        title: 'ERD작성하기',
        state: 'ToDo',
        point: 0,
        condition: '인수조건은 다음과같다~~',
      },
    };
    describe('POST /api/epic 에픽생성', () => {
      it('성공', async () => {
        postEpicResponse = await request(httpServer).post(epicURI).send(postEpicPayload).expect(HttpStatus.CREATED);
        expect(postEpicResponse.body).toHaveProperty('epicId');
        expect(typeof postEpicResponse.body.epicId).toBe('number');
      });

      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(epicURI)
          .send({
            projectId: '3',
            epicTitle: '이거슨타이틀',
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', () =>
        request(httpServer)
          .post(epicURI)
          .send({
            projectId: 3,
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('PUT /api/epic 에픽수정', () => {
      it('성공', async () => {
        await request(httpServer)
          .put(epicURI)
          .send({
            projectId: 3,
            epic: {
              id: postEpicResponse.body.epicId,
              title: '수정된 제목',
            },
          })
          .expect(HttpStatus.OK);
      });
      it('잘못된 데이터 형식', async () => {
        await request(httpServer)
          .put(epicURI)
          .send({
            projectId: '1',
            epic: {
              id: postEpicResponse.body.epicId,
              title: '수정된 제목',
            },
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('데이터 필드 누락', async () => {
        await request(httpServer)
          .put(epicURI)
          .send({
            projectId: '1',
            epic: {
              id: postEpicResponse.body.epicId,
            },
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
    describe('DELETE /api/epic 에픽삭제', () => {
      it('성공', async () => {
        await request(httpServer)
          .delete(epicURI)
          .send({
            projectId: 1,
            epicId: postEpicResponse.body.epicId,
          })
          .expect(HttpStatus.OK);
      });
      it('이미 삭제된 데이터', async () => {
        await request(httpServer)
          .delete(epicURI)
          .send({
            projectId: 1,
            epicId: postEpicResponse.body.epicId,
          })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
      it('잘못된 데이터 형식', async () => {
        await request(httpServer)
          .delete(epicURI)
          .send({
            projectId: '1',
            epicId: postEpicResponse.body.epicId,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('데이터 필드 누락', async () => {
        await request(httpServer)
          .delete(epicURI)
          .send({
            epicId: postEpicResponse.body.epicId,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
    describe('POST /api/story 스토리생성', () => {
      it('성공', async () => {
        postEpicResponse = await request(httpServer).post(epicURI).send(postEpicPayload).expect(HttpStatus.CREATED);
        postStoryPayload.story.epicId = postEpicResponse.body.epicId;
        postStoryResponse = await request(httpServer).post(storyURI).send(postStoryPayload).expect(HttpStatus.CREATED);
        expect(postStoryResponse.body).toHaveProperty('storyId');
        expect(typeof postStoryResponse.body.storyId).toBe('number');
      });

      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(storyURI)
          .send({
            projectId: 3,
            story: {
              epicId: postEpicResponse.body.epicId,
              title: 3,
            },
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('필요한 데이터 누락', () =>
        request(httpServer)
          .post(epicURI)
          .send({
            projectId: 3,
            story: {
              epicId: postEpicResponse.body.epicId,
            },
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('PUT /api/story 스토리생성', () => {
      it('성공', async () => {
        await request(httpServer)
          .put(storyURI)
          .send({
            projectId: 1,
            story: {
              id: postStoryResponse.body.storyId,
              title: '수정된 스토리',
            },
          })
          .expect(HttpStatus.OK);
      });

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .put(storyURI)
          .send({
            projectId: 1,
            story: {
              id: postStoryResponse.body.storyId,
              title: 1,
            },
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', async () =>
        await request(httpServer)
          .put(storyURI)
          .send({
            projectId: 1,
            story: {
              id: postStoryResponse.body.storyId,
            },
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('DELETE /api/story 스토리삭제', () => {
      it('성공', async () => {
        await request(httpServer)
          .delete(storyURI)
          .send({ projectId: 1, storyId: postStoryResponse.body.storyId })
          .expect(HttpStatus.OK);
      });

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .delete(storyURI)
          .send({ projectId: '1', storyId: postStoryResponse.body.storyId })
          .expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', async () =>
        await request(httpServer).delete(storyURI).send({ projectId: 1 }).expect(HttpStatus.BAD_REQUEST));
    });
    describe('POST /api/task 태스크 생성', () => {
      it('성공', async () => {
        postEpicResponse = await request(httpServer).post(epicURI).send(postEpicPayload).expect(HttpStatus.CREATED);
        postStoryPayload.story.epicId = postEpicResponse.body.epicId;
        postStoryResponse = await request(httpServer).post(storyURI).send(postStoryPayload).expect(HttpStatus.CREATED);
        postTaskPayload.task.epicId = postEpicResponse.body.epicId;
        postTaskPayload.task.storyId = postStoryResponse.body.storyId;
        postTaskResponse = await request(httpServer).post(taskURI).send(postTaskPayload).expect(HttpStatus.CREATED);
        expect(postTaskResponse.body).toHaveProperty('taskId');
        expect(typeof postTaskResponse.body.taskId).toBe('number');
      });
      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(taskURI)
          .send({
            projectId: 1,
            task: {
              epicId: null,
              storyId: null,
              userId: 1,
              title: 'ERD작성하기',
              state: 'ToDo',
              point: '0',
              condition: '인수조건은 다음과같다~~',
            },
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('필요한 데이터 누락', () =>
        request(httpServer)
          .post(taskURI)
          .send({
            projectId: 1,
            task: {
              epicId: null,
              storyId: null,
              userId: 1,
              title: 'ERD작성하기',
              point: 0,
              condition: '인수조건은 다음과같다~~',
            },
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('PATCH /api/backlogs/task 태스크 수정', () => {
      it('성공', async () =>
        await request(httpServer)
          .patch(taskURI)
          .send({
            projectId: 1,
            task: {
              id: postTaskResponse.body.taskId,
              userId: 3,
              state: 'ToDo2',
              point: 10,
              condition: '인수조건은 다음과같다~~',
            },
          })
          .expect(HttpStatus.OK));

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .patch(taskURI)
          .send({
            projectId: 1,
            task: {
              id: postTaskResponse.body.taskId,
              userId: '3',
              state: 'ToDo2',
              point: 10,
              condition: '인수조건은 다음과같다~~',
            },
          })
          .expect(400));

      it('필요한 데이터 누락', async () =>
        await request(httpServer)
          .patch(taskURI)
          .send({
            projectId: 1,
            task: {
              userId: '3',
              state: 'ToDo2',
              point: 10,
              condition: '인수조건은 다음과같다~~',
            },
          })
          .expect(400));
    });

    describe('DELETE /api/backlogs/task 태스크 삭제', () => {
      it('성공', async () =>
        await request(httpServer)
          .delete(taskURI)
          .send({
            projectId: 1,
            taskId: postTaskResponse.body.taskId,
          })
          .expect(200));

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .delete(taskURI)
          .send({
            projectId: '1',
            taskId: postTaskResponse.body.taskId,
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('필요한 데이터 누락', async () =>
        await request(httpServer)
          .delete(taskURI)
          .send({
            projectId: 1,
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
  });
});
