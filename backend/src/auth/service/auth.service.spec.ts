import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LesserConfigModule } from 'src/lesser-config/lesser-config.module';
import { GITHUB_CLIENT_ID } from 'src/lesser-config/constants';
import { AuthService } from './auth.service';

describe('getGithubAuthUrl', () => {
  let service: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LesserConfigModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return a valid GitHub authorization URL', async () => {
    const authUrl = service.getGithubAuthUrl();
    const urlPattern = new RegExp(
      `^https://github.com/login/oauth/authorize\\?client_id=${configService.get(GITHUB_CLIENT_ID)}&scope=[\\w]*$`,
    );
    expect(authUrl).toMatch(urlPattern);
  });
});
