import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

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
    const PROJECT_URI = '/api/projects';
    describe('POST /api/epic 에픽생성', () => {
      it('성공', async () => {
        const projectResponse = await request(httpServer)
          .post(PROJECT_URI)
          .send({ name: 'Lesser' })
          .expect(HttpStatus.CREATED);
        expect(typeof projectResponse.body.id).toBe('number');
        postEpicPayload.projectId = projectResponse.body.id;
        postEpicResponse = await request(httpServer).post(epicURI).send(postEpicPayload).expect(HttpStatus.CREATED);
        expect(postEpicResponse.body).toHaveProperty('id');
        expect(typeof postEpicResponse.body.id).toBe('number');
      });

      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(epicURI)
          .send({
            projectId: postEpicPayload.projectId,
            title: 3,
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', () =>
        request(httpServer)
          .post(epicURI)
          .send({
            id: postEpicPayload.projectId,
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('PUT /api/epic 에픽수정', () => {
      it('성공', async () => {
        await request(httpServer)
          .put(epicURI)
          .send({
            id: postEpicResponse.body.id,
            title: '수정된 제목',
          })
          .expect(HttpStatus.OK);
      });
      it('잘못된 데이터 형식', async () => {
        await request(httpServer)
          .put(epicURI)
          .send({
            id: postEpicResponse.body.id,
            title: 3,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('데이터 필드 누락', async () => {
        await request(httpServer)
          .put(epicURI)
          .send({
            id: postEpicResponse.body.id,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
    describe('DELETE /api/epic 에픽삭제', () => {
      it('성공', async () => {
        await request(httpServer)
          .delete(epicURI)
          .send({
            id: postEpicResponse.body.id,
          })
          .expect(HttpStatus.OK);
      });
      it('이미 삭제된 데이터', async () => {
        await request(httpServer)
          .delete(epicURI)
          .send({
            id: postEpicResponse.body.id,
          })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
      it('잘못된 데이터 형식', async () => {
        await request(httpServer)
          .delete(epicURI)
          .send({
            id: 'postEpicResponse.body.epicId,',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('데이터 필드 누락', async () => {
        await request(httpServer).delete(epicURI).send({}).expect(HttpStatus.BAD_REQUEST);
      });
    });
    describe('POST /api/story 스토리생성', () => {
      it('성공', async () => {
        postEpicResponse = await request(httpServer).post(epicURI).send(postEpicPayload).expect(HttpStatus.CREATED);
        postStoryPayload.epicId = postEpicResponse.body.id;
        postStoryResponse = await request(httpServer).post(storyURI).send(postStoryPayload).expect(HttpStatus.CREATED);
        expect(postStoryResponse.body).toHaveProperty('id');
        expect(typeof postStoryResponse.body.id).toBe('number');
      });

      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(storyURI)
          .send({
            epicId: postEpicResponse.body.id,
            title: 3,
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('필요한 데이터 누락', () =>
        request(httpServer)
          .post(epicURI)
          .send({
            epicId: postEpicResponse.body.id,
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('PUT /api/story 스토리생성', () => {
      it('성공', async () => {
        await request(httpServer)
          .put(storyURI)
          .send({
            id: postStoryResponse.body.id,
            title: '수정된 스토리',
          })
          .expect(HttpStatus.OK);
      });

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .put(storyURI)
          .send({
            id: postStoryResponse.body.id,
            title: 3,
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', async () =>
        await request(httpServer)
          .put(storyURI)
          .send({
            id: postStoryResponse.body.id,
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
    describe('DELETE /api/story 스토리삭제', () => {
      it('성공', async () => {
        await request(httpServer).delete(storyURI).send({ id: postStoryResponse.body.id }).expect(HttpStatus.OK);
      });

      it('잘못된 데이터 형식', async () =>
        await request(httpServer).delete(storyURI).send({ id: '1' }).expect(HttpStatus.BAD_REQUEST));

      it('데이터 필드 누락', async () =>
        await request(httpServer).delete(storyURI).send({}).expect(HttpStatus.BAD_REQUEST));
    });
    describe('POST /api/task 태스크 생성', () => {
      it('성공', async () => {
        postEpicResponse = await request(httpServer).post(epicURI).send(postEpicPayload).expect(HttpStatus.CREATED);
        postStoryPayload.epicId = postEpicResponse.body.id;
        postStoryResponse = await request(httpServer).post(storyURI).send(postStoryPayload).expect(HttpStatus.CREATED);
        postTaskPayload.storyId = postStoryResponse.body.id;
        postTaskResponse = await request(httpServer).post(taskURI).send(postTaskPayload).expect(HttpStatus.CREATED);
        expect(postTaskResponse.body).toHaveProperty('id');
        expect(typeof postTaskResponse.body.id).toBe('number');
      });
      it('잘못된 데이터 형식', () =>
        request(httpServer)
          .post(taskURI)
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
          .post(taskURI)
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
          .patch(taskURI)
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
          .patch(taskURI)
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
          .patch(taskURI)
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
          .delete(taskURI)
          .send({
            id: postTaskResponse.body.id,
          })
          .expect(200));

      it('잘못된 데이터 형식', async () =>
        await request(httpServer)
          .delete(taskURI)
          .send({
            id: 'postTaskResponse.body.id',
          })
          .expect(HttpStatus.BAD_REQUEST));

      it('필요한 데이터 누락', async () =>
        await request(httpServer)
          .delete(taskURI)
          .send({
            id: 'postTaskResponse.body.id',
          })
          .expect(HttpStatus.BAD_REQUEST));
    });
  });
});
