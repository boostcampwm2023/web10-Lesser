import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LesserConfigModule } from './lesser-config.module';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRETS,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} from './constants';

describe('Lesser Config Unit Test', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LesserConfigModule],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  describe('Get Env Variables', () => {
    it('should return env variables', async () => {
      if (process.env.NODE_ENV !== 'CI') {
        expect(configService.get(GITHUB_CLIENT_ID)).toBeDefined();
        expect(configService.get(GITHUB_CLIENT_SECRETS)).toBeDefined();
        expect(configService.get(DATABASE_HOST)).toBeDefined();
        expect(configService.get(DATABASE_PORT)).toBeDefined();
        expect(configService.get(DATABASE_USER)).toBeDefined();
        expect(configService.get(DATABASE_PASSWORD)).toBeDefined();
        expect(configService.get(DATABASE_NAME)).toBeDefined();
      }
    });
  });
});
