import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { GithubApiService } from 'src/github-api/github-api.service';

describe('Auth Service Unit Test', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let githubApiService: GithubApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: GithubApiService,
          useValue: {
            fetchAccessToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    githubApiService = module.get<GithubApiService>(GithubApiService);
  });

  describe('Get Github Auth Url', () => {
    it('should return a valid GitHub authorization URL', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('client_id');
      const authUrl = authService.getGithubAuthUrl();
      const urlPattern = new RegExp(
        `^https://github.com/login/oauth/authorize\\?client_id=[\\w]+&scope=[\\w]*$`,
      );
      expect(authUrl).toMatch(urlPattern);
    });
  });

  describe('Get AccessToken', () => {
    it('should return github access token', async () => {
      jest
        .spyOn(githubApiService, 'fetchAccessToken')
        .mockResolvedValue({ access_token: 'access token' });
      const accessToken = await authService.getAccessToken('auth code');
      expect(accessToken).toEqual('access token');
      expect(githubApiService.fetchAccessToken).toHaveBeenCalled();
    });

    it('should return Error', async () => {
      jest
        .spyOn(githubApiService, 'fetchAccessToken')
        .mockRejectedValue(new Error('Invalid authorization code'));

      try {
        await authService.getAccessToken('auth code');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
