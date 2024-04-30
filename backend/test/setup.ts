import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { GithubApiService } from 'src/github-api/github-api.service';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { DataSource } from 'typeorm';
import { Project } from 'src/project/entity/project.entity';
import { CreateProjectRequestDto } from 'src/project/dto/CreateProjectRequest.dto';
import { io } from 'socket.io-client';

export let app: INestApplication;
export let githubApiService: GithubApiService;
export let lesserJwtService: LesserJwtService;
export let dataSource: DataSource;
export const jwtTokenPattern =
  /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const projectPayload = {
  title: 'Lesser1',
  subject: '애자일한 프로젝트 관리 툴',
};

export const memberFixture = {
  github_id: 123,
  github_username: 'github_username',
  github_image_url: 'avatar_url',
  username: 'username',
  position: 'position',
  tech_stack: { stacks: ['js', 'ts'] },
};

export const memberFixture2 = {
  github_id: 321,
  github_username: 'github_username',
  github_image_url: 'avatar_url',
  username: 'username2',
  position: 'position',
  tech_stack: { stacks: ['js', 'ts'] },
};

export const githubUserFixture = {
  id: '123',
  login: 'username',
  avatar_url: 'avatar_url',
};

export const createMember = async (newMember, app: INestApplication) => {
  const authenticationResponse = await request(app.getHttpServer())
    .post('/api/auth/github/authentication')
    .send({ authCode: 'authCode' });
  const signupResponse = await request(app.getHttpServer())
    .post('/api/auth/github/signup')
    .set('Authorization', `Bearer ${authenticationResponse.body.tempIdToken}`)
    .send({
      username: newMember.username,
      position: newMember.position,
      techStack: newMember.tech_stack.stacks,
    });
  const [, refreshToken] =
    signupResponse.header['set-cookie'][0].match(/refreshToken=([^;]+)/);
  return { accessToken: signupResponse.body.accessToken, refreshToken };
};

export const createProject = async (
  accessToken: String,
  projectPayload: CreateProjectRequestDto,
  app: INestApplication,
): Promise<Project> => {
  await request(app.getHttpServer())
    .post('/api/project')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(projectPayload);
  const response = await request(app.getHttpServer())
    .get('/api/project')
    .set('Authorization', `Bearer ${accessToken}`);
  const [project] = response.body.projects;
  return project;
};

export const connectServer = (projectId, accessToken) => {
  const socket = io(`http://localhost:3000/project-${projectId}`, {
    path: '/api/socket.io',
    auth: {
      accessToken,
    },
  });
  return socket;
};

export const appInit = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(GithubApiService)
    .useValue({
      fetchAccessToken: jest
        .fn()
        .mockResolvedValue({ access_token: 'github.access.token' }),
      fetchGithubUser: jest.fn().mockResolvedValue(githubUserFixture),
    })
    .compile();
  githubApiService = moduleFixture.get<GithubApiService>(GithubApiService);
  lesserJwtService = moduleFixture.get<LesserJwtService>(LesserJwtService);

  app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.init();
};

beforeAll(async () => {
  await appInit();
});

beforeEach(async () => {
  dataSource = app.get(DataSource);
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM \`${entity.tableName}\``);
  }
});

afterAll(async () => {
  await app.close();
});
