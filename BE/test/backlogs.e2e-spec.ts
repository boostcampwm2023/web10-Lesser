import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { take } from 'rxjs';

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
    const EPIC_URI = '/api/backlogs/Epic';
    const STORY_URI = '/api/backlogs/Story';
    const TASK_URI = '/api/backlogs/Task';
    const BACKLOG_URI = '/api/backlogs';
    let postEpicResponse;
    let postStoryResponse;
    let postTaskResponse;
    const PROJECT_URI = '/api/projects';
    const postEpicPayload = { projectId: null, title: '이거슨타이틀' };
    const postStoryPayload = {
      epicId: null,
      title: '회원은 로그인을 할 수 없다.',
    };
    const postTaskPayload = {
      storyId: null,
      title: 'ERD작성하기',
      state: 'ToDo',
      point: 0,
      condition: '인수조건은 다음과같다~~',
    };
    let projectResponse;
    describe('POST /api/epic 에픽생성', () => {
      it('성공', async () => {
        projectResponse = await request(httpServer)
          .post(PROJECT_URI)
          .send({ name: 'Lesser' })
          .expect(HttpStatus.CREATED);
        expect(typeof projectResponse.body.id).toBe('number');
        postEpicPayload.projectId = projectResponse.body.id;
        postEpicResponse = await request(httpServer).post(EPIC_URI).send(postEpicPayload).expect(HttpStatus.CREATED);
        expect(postEpicResponse.body).toHaveProperty('id');
        expect(typeof postEpicResponse.body.id).toBe('number');
      });

      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(EPIC_URI)
          .send({
            projectId: postEpicPayload.projectId,
            title: 3,
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', () =>
        request(httpServer)
          .post(EPIC_URI)
          .send({
            id: postEpicPayload.projectId,
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('PUT /api/epic 에픽수정', () => {
      it('성공', async () => {
        await request(httpServer)
          .put(EPIC_URI)
          .send({
            id: postEpicResponse.body.id,
            title: '수정된 제목',
          })
          .expect(HttpStatus.OK);
      });
      it('잘못된 데이터 형식', async () => {
        await request(httpServer)
          .put(EPIC_URI)
          .send({
            id: postEpicResponse.body.id,
            title: 3,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('데이터 필드 누락', async () => {
        await request(httpServer)
          .put(EPIC_URI)
          .send({
            id: postEpicResponse.body.id,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
    describe('DELETE /api/epic 에픽삭제', () => {
      it('성공', async () => {
        await request(httpServer)
          .delete(EPIC_URI)
          .send({
            id: postEpicResponse.body.id,
          })
          .expect(HttpStatus.OK);
      });
      it('이미 삭제된 데이터', async () => {
        await request(httpServer)
          .delete(EPIC_URI)
          .send({
            id: postEpicResponse.body.id,
          })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
      it('잘못된 데이터 형식', async () => {
        await request(httpServer)
          .delete(EPIC_URI)
          .send({
            id: 'postEpicResponse.body.epicId,',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('데이터 필드 누락', async () => {
        await request(httpServer).delete(EPIC_URI).send({}).expect(HttpStatus.BAD_REQUEST);
      });
    });
    describe('POST /api/story 스토리생성', () => {
      it('성공', async () => {
        postEpicResponse = await request(httpServer).post(EPIC_URI).send(postEpicPayload).expect(HttpStatus.CREATED);
        postStoryPayload.epicId = postEpicResponse.body.id;
        postStoryResponse = await request(httpServer).post(STORY_URI).send(postStoryPayload).expect(HttpStatus.CREATED);
        expect(postStoryResponse.body).toHaveProperty('id');
        expect(typeof postStoryResponse.body.id).toBe('number');
      });

      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(STORY_URI)
          .send({
            epicId: postEpicResponse.body.id,
            title: 3,
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('필요한 데이터 누락', () =>
        request(httpServer)
          .post(EPIC_URI)
          .send({
            epicId: postEpicResponse.body.id,
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('PUT /api/story 스토리생성', () => {
      it('성공', async () => {
        await request(httpServer)
          .put(STORY_URI)
          .send({
            id: postStoryResponse.body.id,
            title: '수정된 스토리',
          })
          .expect(HttpStatus.OK);
      });

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .put(STORY_URI)
          .send({
            id: postStoryResponse.body.id,
            title: 3,
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', async () =>
        await request(httpServer)
          .put(STORY_URI)
          .send({
            id: postStoryResponse.body.id,
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('DELETE /api/story 스토리삭제', () => {
      it('성공', async () => {
        await request(httpServer).delete(STORY_URI).send({ id: postStoryResponse.body.id }).expect(HttpStatus.OK);
      });

      it('잘못된 데이터 형식', async () =>
        await request(httpServer).delete(STORY_URI).send({ id: '1' }).expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', async () =>
        await request(httpServer).delete(STORY_URI).send({}).expect(HttpStatus.BAD_REQUEST));
    });
    describe('POST /api/task 태스크 생성', () => {
      it('성공', async () => {
        postEpicResponse = await request(httpServer).post(EPIC_URI).send(postEpicPayload).expect(HttpStatus.CREATED);
        postStoryPayload.epicId = postEpicResponse.body.id;
        postStoryResponse = await request(httpServer).post(STORY_URI).send(postStoryPayload).expect(HttpStatus.CREATED);
        postTaskPayload.storyId = postStoryResponse.body.id;
        postTaskResponse = await request(httpServer).post(TASK_URI).send(postTaskPayload).expect(HttpStatus.CREATED);
        expect(postTaskResponse.body).toHaveProperty('id');
        expect(typeof postTaskResponse.body.id).toBe('number');
      });
      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(TASK_URI)
          .send({
            storyId: postStoryResponse.body.id,
            title: 'ERD작성하기',
            state: 'ToDo',
            point: '0',
            condition: '인수조건은 다음과같다~~',
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('필요한 데이터 누락', () =>
        request(httpServer)
          .post(TASK_URI)
          .send({
            storyId: postStoryResponse.body.id,
            title: 'ERD작성하기',
            state: 'ToDo',
            condition: '인수조건은 다음과같다~~',
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('PATCH /api/backlogs/task 태스크 수정', () => {
      it('성공', async () =>
        await request(httpServer)
          .patch(TASK_URI)
          .send({
            id: postTaskResponse.body.id,
            title: '수정된 제목',
            state: 'ToDo',
            point: 0,
            condition: '인수조건은 다음과같다~~',
          })
          .expect(HttpStatus.OK));

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .patch(TASK_URI)
          .send({
            id: postTaskResponse.body.id,
            title: '수정된 제목',
            state: 3,
            point: 0,
            condition: '인수조건은 다음과같다~~',
          })
          .expect(400));

      it('필요한 데이터 누락', async () =>
        await request(httpServer)
          .patch(TASK_URI)
          .send({
            title: '수정된 제목',
            point: 0,
            condition: '인수조건은 다음과같다~~',
          })
          .expect(400));
    });

    describe('DELETE /api/backlogs/task 태스크 삭제', () => {
      it('성공', async () =>
        await request(httpServer)
          .delete(TASK_URI)
          .send({
            id: postTaskResponse.body.id,
          })
          .expect(200));

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .delete(TASK_URI)
          .send({
            id: 'postTaskResponse.body.id',
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('필요한 데이터 누락', async () =>
        await request(httpServer)
          .delete(TASK_URI)
          .send({
            id: 'postTaskResponse.body.id',
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('GET /api/backlog/{id}', () => {
      let projectId;
      it('성공', async () => {
        projectId = (await request(httpServer).post(PROJECT_URI).send({ name: '프로젝트' })).body.id;
        const epicId = (await request(httpServer).post(EPIC_URI).send({ projectId: projectId, title: '타이틀2' })).body
          .id;
        const storyId = (await request(httpServer).post(STORY_URI).send({ epicId: epicId, title: 'title' })).body.id;
        postTaskPayload.storyId = storyId;
        const taskId = (await request(httpServer).post(TASK_URI).send(postTaskPayload)).body.id;
        const getBacklogResponse = await request(httpServer)
          .get(`${BACKLOG_URI}/${projectId}`)
          .send()
          .expect(HttpStatus.OK);

        expect(getBacklogResponse.body.epicList[0].id).toBe(epicId);
        expect(getBacklogResponse.body.epicList[0].storyList[0].id).toBe(storyId);
        expect(getBacklogResponse.body.epicList[0].storyList[0].taskList[0].id).toBe(taskId);
      });
      it('존재하지 않는 프로젝트', async () => {
        await request(httpServer)
          .get(`${BACKLOG_URI}/${projectId + 1}`)
          .send()
          .expect(HttpStatus.NOT_FOUND);
      });
      it('잘못된 데이터 형식', async () => {
        await request(httpServer).get(`${BACKLOG_URI}/aa`).send().expect(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
