import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });
  const PROJECT_URI = '/api/projects';
  describe(`POST ${PROJECT_URI} 프로젝트 생성`, () => {
    it('성공', async () =>
      await request(httpServer)
        .post(PROJECT_URI)
        .send({
          name: 'Lesser',
        })
        .expect(201));

    it('잘못된 데이터 형식', async () =>
      await request(httpServer)
        .post(PROJECT_URI)
        .send({
          name: 3,
        })
        .expect(HttpStatus.BAD_REQUEST));

    it('필요한 데이터 누락', async () =>
      await request(httpServer)
        .post(PROJECT_URI)
        .send({
          name2: 3,
        })
        .expect(HttpStatus.BAD_REQUEST));
  });
});
