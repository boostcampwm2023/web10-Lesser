import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { GithubApiService } from 'src/github-api/github-api.service';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { Member } from 'src/member/entity/member.entity';
import { DataSource } from 'typeorm';

export let app: INestApplication;
export let githubApiService: GithubApiService;
export let lesserJwtService: LesserJwtService;
export let dataSource: DataSource;
export const jwtTokenPattern =
  /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const memberFixture = {
  github_id: 123,
  github_username: 'github_username',
  github_image_url: 'avatar_url',
  username: 'username',
  position: 'position',
  tech_stack: { stacks: ['js', 'ts'] },
};

export const createMember = async (newMember) => {
  const memberRepository = dataSource.getRepository(Member);
  const member = await memberRepository.save(newMember);
  const [accessToken, refreshToken] = await Promise.all([
    lesserJwtService.createAccessToken(member.id),
    lesserJwtService.createRefreshToken(member.id),
  ]);
  return { accessToken, refreshToken, member };
};

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(GithubApiService)
    .useValue({
      fetchAccessToken: jest
        .fn()
        .mockResolvedValue({ access_token: 'github.access.token' }),
      fetchGithubUser: jest.fn().mockResolvedValue({
        id: '123',
        login: 'username',
        avatar_url: 'avatar_url',
      }),
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
