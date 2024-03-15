import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    dataSource = app.get(DataSource);
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  });

  it('/auth/github/authorization-server (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/auth/github/authorization-server',
    );
    const urlPattern = new RegExp(
      `^https://github.com/login/oauth/authorize\\?client_id=[\\w]+&scope=[\\w]*$`,
    );
    expect(response.status).toBe(200);
    expect(response.body.authUrl).toMatch(urlPattern);
  });

  afterAll(async () => {
    await app.close();
  });
});
